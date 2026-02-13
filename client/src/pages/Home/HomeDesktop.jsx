import { useEffect, useState, useRef } from 'react';
import { TextField, Select, MenuItem, Button, InputLabel, FormControl } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import ReleaseCard from '../../components/ReleaseCard/ReleaseCard';
import './homeDesktop.css';

function HomeDesktop() {
  const searchRef = useRef(null);
  const [releases, setReleases] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [discFilter, setDiscFilter] = useState('ALL');
  const [alphaOrder, setAlphaOrder] = useState(null);
  const [yearOrder, setYearOrder] = useState(null);

  console.info('releases', releases);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  /* =======================
     FETCH RELEASES
  ======================= */
  const fetchReleases = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/release`);
      const data = await res.json();
      setReleases(data);
    } catch (err) {
      console.error('Erreur fetch releases:', err);
    }
  };

  // useEffect pour charger les données au montage
  useEffect(() => {
    fetchReleases();
  }, []);

  /* =======================
     FETCH GENRES
  ======================= */

  const fetchGenres = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/genre`);
      const data = await res.json();
      setGenres(data);
    } catch (err) {
      console.error('Erreur fetch genres:', err);
    }
  };

  useEffect(() => {
    fetchReleases();
    fetchGenres();
  }, []);

  /* =======================
     RESET
  ======================= */

  const handleReset = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setDiscFilter('ALL');
    setAlphaOrder(null);
    setYearOrder(null);
  };

  /* =======================
     SORT TOGGLES
  ======================= */

  const handleAlphaSort = () => {
    if (alphaOrder === 'asc') setAlphaOrder('desc');
    else setAlphaOrder('asc');

    setYearOrder(null);
  };

  const handleYearSort = () => {
    if (yearOrder === 'asc') setYearOrder('desc');
    else setYearOrder('asc');

    setAlphaOrder(null);
  };

  /* =======================
     FILTRE
  ======================= */

  const filteredReleases = releases
    // 🔎 Recherche
    .filter((release) => release.title.toLowerCase().includes(searchTerm.toLowerCase()))

    // 🎵 Genre
    .filter((release) =>
      selectedGenre ? release.genres?.toLowerCase().includes(selectedGenre.toLowerCase()) : true,
    )

    // 💿 Disc Size
    .filter((release) => {
      if (discFilter === '33T') return release.disc_size === '12';
      if (discFilter === '45T') return release.disc_size === '7';
      return true;
    })

    // 🔤 + ⏳ Tri cumulatif
    .sort((a, b) => {
      // 1️⃣ Tri alphabétique
      if (alphaOrder) {
        return alphaOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }

      // 2️⃣ Tri chronologique
      if (yearOrder) {
        return yearOrder === 'asc' ? a.year - b.year : b.year - a.year;
      }

      // 3️⃣ Pas de tri
      return 0;
    });

  /* =======================
     OPEN MODAL
  ======================= */
  const handleOpenModal = (release) => {
    console.log('Release clicked:', release);
    // code Modal ici
  };

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="home-desktop">
      <section className="search_filter_section_desktop sticky-section">
        {/* SEARCH */}
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          inputRef={searchRef}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchTerm('');
                    searchRef.current?.focus();
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* GENRE SELECT */}
        <FormControl size="small" style={{ minWidth: 150 }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={selectedGenre}
            label="Genre"
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>

            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.name}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* DISC FILTER */}
        <div>
          <Button
            variant={discFilter === 'ALL' ? 'contained' : 'outlined'}
            onClick={() => setDiscFilter('ALL')}
          >
            TOUT
          </Button>

          <Button
            variant={discFilter === '33T' ? 'contained' : 'outlined'}
            onClick={() => setDiscFilter('33T')}
          >
            33T
          </Button>

          <Button
            variant={discFilter === '45T' ? 'contained' : 'outlined'}
            onClick={() => setDiscFilter('45T')}
          >
            45T
          </Button>
        </div>

        {/* ALPHABETICAL */}
        <div>
          <Button variant="outlined" onClick={handleAlphaSort}>
            A-Z{' '}
            {(() => {
              if (alphaOrder === 'asc') return '↑';
              if (alphaOrder === 'desc') return '↓';
              return '';
            })()}
          </Button>
          <Button variant="outlined" onClick={handleYearSort}>
            Year{' '}
            {(() => {
              if (yearOrder === 'asc') return '↑';
              if (yearOrder === 'desc') return '↓';
              return '';
            })()}
          </Button>
        </div>

        {/* RESET */}
        <Button color="error" variant="outlined" onClick={handleReset}>
          RESET
        </Button>
      </section>

      <section className="releases_list_section_desktop">
        {filteredReleases.map((release) => (
          <ReleaseCard
            key={release.id}
            release={release}
            imageBaseUrl={`${backendUrl}/images`}
            onClick={handleOpenModal}
          />
        ))}
      </section>
    </div>
  );
}

export default HomeDesktop;
