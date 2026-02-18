import { useEffect, useState, useRef, useMemo } from 'react';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { Link } from 'react-router-dom';
import ItemCard from '../../components/ItemCard/ItemCard';
import './artist.css';

function Artists() {
  const [artists, setArtists] = useState([]);
  // states search
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);
  // states loader
  const [loadingReleases, setLoadingReleases] = useState(true);

  console.info('artists', artists);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;
  const cloudinaryUrl = `${import.meta.env.VITE_CLOUDINARY_BASE_URL}`;

  /* =======================
     FETCH ARTISTS
  ======================= */
  const fetchArtists = async () => {
    try {
      setLoadingReleases(true);
      const res = await fetch(`${backendUrl}/api/artist`);
      const data = await res.json();
      setArtists(data);
    } catch (err) {
      console.error('Erreur fetch Artists:', err);
    } finally {
      setLoadingReleases(false);
    }
  };

  // useEffect pour charger les données au montage
  useEffect(() => {
    fetchArtists();
  }, []);

  /* =======================
     SEARCH
  ======================= */

  const filteredArtists = useMemo(() => {
    return artists.filter((artist) =>
      artist.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [artists, searchTerm]);

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="artists_page">
      <section className="search_filter_section_artists sticky-section">
        {/* SEARCH */}
        <TextField
          label="Search artist"
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
      </section>
      <section className="artists_list_section">
        {loadingReleases ? (
          <div className="loader" />
        ) : (
          filteredArtists.map((artist) => (
            <Link
              key={artist.id}
              to={`/artist/${artist.id}`}
              state={{ artistName: artist.name }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ItemCard
                key={artist.id}
                item={artist}
                imageBaseUrl={`${cloudinaryUrl}/jvm/artists`}
              />
            </Link>
          ))
        )}
      </section>
    </div>
  );
}

export default Artists;
