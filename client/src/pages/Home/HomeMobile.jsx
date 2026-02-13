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
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  CircularProgress,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import { useFormat } from '../../context/FormatContext';
import ReleaseItemMobile from '../../components/ReleaseItemMobile/ReleaseItemMobile';
import GroupHeader from '../../components/GroupHeader/GroupHeader';

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
     RENDER
  ======================= */

  return (
    <div className="home-mobile">
      <section className="sticky-section">
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
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>
          {releaseDetail?.title}
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {loadingDetail && <CircularProgress />}

          {!loadingDetail && releaseDetail && (
            <>
              {/* Cover */}
              {releaseDetail.cover?.[0]?.image_url && (
                <img
                  src={`${backendUrl}/images/${releaseDetail.cover[0].image_url}`}
                  alt={releaseDetail.title}
                  style={{ width: '100%', marginBottom: 16 }}
                />
              )}

              <Typography gutterBottom>
                <Typography component="span" fontWeight="bold">
                  Artistes:
                </Typography>{' '}
                {releaseDetail.artists.map((a) => a.name).join(', ')}
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="bold">
                  Labels:
                </Typography>{' '}
                {releaseDetail.labels.map((l) => `${l.name} (${l.catalog_number})`).join(', ')}
              </Typography>

              {releaseDetail.genres && (
                <Typography gutterBottom>
                  <Typography component="span" fontWeight="bold">
                    Genres:
                  </Typography>{' '}
                  {releaseDetail.genres.map((g) => g.name).join(', ')}
                </Typography>
              )}

              {releaseDetail.styles && (
                <Typography gutterBottom>
                  <Typography component="span" fontWeight="bold">
                    Styles:
                  </Typography>{' '}
                  {releaseDetail.styles.map((s) => s.name).join(', ')}
                </Typography>
              )}

              {releaseDetail.year > 0 && (
                <Typography gutterBottom>
                  <Typography component="span" fontWeight="bold">
                    Année:
                  </Typography>{' '}
                  {releaseDetail.year}
                </Typography>
              )}

              {releaseDetail.country && (
                <Typography gutterBottom>
                  <Typography component="span" fontWeight="bold">
                    Pays:
                  </Typography>{' '}
                  {releaseDetail.country}
                </Typography>
              )}

              {releaseDetail.barcode && (
                <Typography gutterBottom>
                  <Typography component="span" fontWeight="bold">
                    Barcode:
                  </Typography>{' '}
                  {releaseDetail.barcode}
                </Typography>
              )}

              {/* Tracklist */}
              {releaseDetail.tracks && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Tracklist
                  </Typography>
                  {releaseDetail.tracks.map((track) => (
                    <Typography key={`${track.disc_number}-${track.position}`} variant="body2">
                      {track.position} - {track.title}
                    </Typography>
                  ))}{' '}
                </>
              )}

              {releaseDetail.notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {releaseDetail.notes}
                  </Typography>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* END MODAL */}
    </div>
  );
}

export default HomeMobile;
