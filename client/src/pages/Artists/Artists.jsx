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

  console.info('artists', artists);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  /* =======================
     FETCH ARTISTS
  ======================= */
  const fetchArtists = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/artist`);
      const data = await res.json();
      setArtists(data);
    } catch (err) {
      console.error('Erreur fetch Artists:', err);
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
        {filteredArtists.map((artist) => (
          <Link
            key={artist.id}
            to={`/artist/${artist.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ItemCard key={artist.id} item={artist} imageBaseUrl={`${backendUrl}/images`} />
          </Link>
        ))}
      </section>
    </div>
  );
}

export default Artists;
