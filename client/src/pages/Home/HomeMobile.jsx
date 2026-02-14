/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import './homeMobile.css';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormat } from '../../context/FormatContext';
import ReleaseItemMobile from '../../components/ReleaseItemMobile/ReleaseItemMobile';
import GroupHeader from '../../components/GroupHeader/GroupHeader';
import ReleaseDetailDialogMobile from '../../components/ReleaseDetailDialogMobile/ReleaseDetailDialogMobile';

function HomeMobile() {
  const { format } = useFormat();
  const [releases, setReleases] = useState([]);
  const [groupBy, setGroupBy] = useState('title');
  const [search, setSearch] = useState('');
  const [openGroup, setOpenGroup] = useState(null);
  // states modal
  const [selectedReleaseId, setSelectedReleaseId] = useState(null);
  const [releaseDetail, setReleaseDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  console.info('releases', releases);
  console.info('releaseDetail', releaseDetail);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  /* =======================
     FETCH
  ======================= */

  useEffect(() => {
    fetch(`${backendUrl}/api/mobile?size=${format}`)
      .then((res) => res.json())
      .then((data) => {
        setReleases(data);
        setOpenGroup({});
      });
  }, [format]);

  /* =======================
     STRING UTILS
  ======================= */

  const ARTICLES = [
    'LE',
    'LA',
    'LES',
    "L'",
    'UN',
    'UNE',
    'AU',
    'DES',
    'DU',
    'DE',
    "D'",
    'THE',
    'A',
    'AN',
  ];

  const stripLeadingArticle = (value) => {
    if (!value || typeof value !== 'string') return '';

    const trimmed = value.trim();
    const upper = trimmed.toUpperCase();

    const article = ARTICLES.find(
      (a) => upper.startsWith(`${a} `) || (a.endsWith("'") && upper.startsWith(a)),
    );

    if (!article) return trimmed;

    if (article.endsWith("'")) {
      return trimmed.slice(article.length);
    }

    return trimmed.slice(article.length + 1);
  };

  const normalize = (value = '') =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .toUpperCase()
      .trim();

  const looksLikePerson = (name) => name.split(' ').length === 2;

  /* =======================
     SORT KEYS
  ======================= */

  const getTitleSortKey = (title) => {
    const cleaned = stripLeadingArticle(title);
    const match = cleaned.toUpperCase().match(/[A-Z]/);
    return match ? match[0] : '#';
  };

  const getArtistSortKey = (artist) => {
    if (!artist) return '#';

    const noArticle = stripLeadingArticle(artist);

    if (looksLikePerson(noArticle)) {
      const parts = noArticle.split(' ');
      return normalize(parts[parts.length - 1]); // nom de famille
    }

    return normalize(noArticle);
  };

  const getGroupValue = (release) => {
    if (groupBy === 'title') return release.title ?? '';
    if (groupBy === 'artist') return release.artists ?? '';
    if (groupBy === 'label') return release.labels ?? '';
    return '';
  };

  const getGroupLetter = (release) => {
    if (groupBy === 'title') return getTitleSortKey(release.title);
    if (groupBy === 'artist') return getArtistSortKey(release.artists)[0] || '#';
    if (groupBy === 'label') return normalize(stripLeadingArticle(release.labels))[0] || '#';
    return '#';
  };

  /* =======================
     FILTER + SEARCH
  ======================= */

  const filteredReleases = useMemo(() => {
    if (!search) return releases;

    return releases.filter((r) => getGroupValue(r).toLowerCase().includes(search.toLowerCase()));
  }, [releases, search, groupBy]);

  /* =======================
     GROUPING + SORT
  ======================= */

  const groupedReleases = useMemo(() => {
    if (search) return null;

    const groups = {};

    filteredReleases.forEach((release) => {
      const letter = getGroupLetter(release);
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(release);
    });

    Object.keys(groups).forEach((letter) => {
      groups[letter].sort((a, b) => {
        if (groupBy === 'title') {
          return stripLeadingArticle(a.title).localeCompare(stripLeadingArticle(b.title), 'fr');
        }

        if (groupBy === 'artist') {
          const artistA = getArtistSortKey(a.artists);
          const artistB = getArtistSortKey(b.artists);

          if (artistA !== artistB) {
            return artistA.localeCompare(artistB, 'fr');
          }

          return stripLeadingArticle(a.title).localeCompare(stripLeadingArticle(b.title), 'fr');
        }

        if (groupBy === 'label') {
          const labelA = getArtistSortKey(a.labels); // 👈 on réutilise la même logique
          const labelB = getArtistSortKey(b.labels);

          if (labelA !== labelB) {
            return labelA.localeCompare(labelB, 'fr');
          }

          return stripLeadingArticle(a.title).localeCompare(stripLeadingArticle(b.title), 'fr');
        }
      });
    });

    return groups;
  }, [filteredReleases, search, groupBy]);

  const sortedLetters = groupedReleases ? Object.keys(groupedReleases).sort() : [];

  /* =======================
     HANDLERS LETTER GROUP
  ======================= */

  const toggleGroup = (letter) => {
    setOpenGroup((prev) => (prev === letter ? null : letter));
  };

  useEffect(() => {
    setOpenGroup(null);
  }, [groupBy]);

  /* =======================
     HANDLERS MODAL
  ======================= */
  const handleOpenInfo = async (release) => {
    setSelectedReleaseId(release.id);
    setOpenModal(true);
    setLoadingDetail(true);

    try {
      const res = await fetch(`${backendUrl}/api/release/${release.id}`);
      const data = await res.json();
      setReleaseDetail(data);
    } catch (err) {
      console.error('Erreur fetch release detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setReleaseDetail(null);
    setSelectedReleaseId(null);
  };

  /* =======================
     LINKS IN MODAL
  ======================= */
  const discogsLink = releaseDetail?.links?.find((link) => link.platform === 'discogs')?.url;

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="home-mobile">
      <section className="sticky-Mobile-section">
        <div className="search_filter_section_mobile">
          {/* SELECT */}
          <FormControl size="small" fullWidth>
            <InputLabel>Recherche par</InputLabel>
            <Select
              value={groupBy}
              label="Grouper par"
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <MenuItem value="title">Titres</MenuItem>
              <MenuItem value="artist">Artistes</MenuItem>
              <MenuItem value="label">Labels</MenuItem>
            </Select>
          </FormControl>

          {/* SEARCH BAR */}
          <TextField
            size="small"
            fullWidth
            placeholder={`Rechercher ${groupBy}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div style={{ borderTop: '1px dashed #ccc', marginBottom: '10px' }} />
      </section>

      {/* RELEASES SECTION */}
      <section className="releases_list_section_mobile">
        {search
          ? filteredReleases.map((r) => (
              <ReleaseItemMobile key={r.id} release={r} onInfoClick={handleOpenInfo} />
            ))
          : sortedLetters.map((letter) => (
              <div key={letter}>
                <GroupHeader
                  letter={letter}
                  isOpen={openGroup === letter}
                  onToggle={() => toggleGroup(letter)}
                />

                {openGroup === letter &&
                  groupedReleases[letter].map((r) => (
                    <ReleaseItemMobile key={r.id} release={r} onInfoClick={handleOpenInfo} />
                  ))}
              </div>
            ))}
      </section>
      {/* END RELEASES SECTION */}

      {/* MODAL */}
      <ReleaseDetailDialogMobile
        open={openModal}
        onClose={handleCloseModal}
        releaseDetail={releaseDetail}
        loadingDetail={loadingDetail}
        backendUrl={backendUrl}
      />
      {/* END MODAL */}
    </div>
  );
}

export default HomeMobile;
