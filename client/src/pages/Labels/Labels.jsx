import { useEffect, useState, useRef, useMemo } from 'react';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { Link } from 'react-router-dom';
import ItemCard from '../../components/ItemCard/ItemCard';
import './label.css';

function Labels() {
  const [labels, setLabels] = useState([]);
  // states search
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);
  // states loader
  const [loadingReleases, setLoadingReleases] = useState(true);

  console.info('labels', labels);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;
  const cloudinaryUrl = `${import.meta.env.VITE_CLOUDINARY_BASE_URL}`;

  /* =======================
     FETCH LABELS
  ======================= */
  const fetchLabels = async () => {
    try {
      setLoadingReleases(true);
      const res = await fetch(`${backendUrl}/api/label`);
      const data = await res.json();
      setLabels(data);
    } catch (err) {
      console.error('Erreur fetch Labels:', err);
    } finally {
      setLoadingReleases(false);
    }
  };

  // useEffect pour charger les données au montage
  useEffect(() => {
    fetchLabels();
  }, []);

  /* =======================
     SEARCH
  ======================= */

  const filteredLabels = useMemo(() => {
    return labels.filter((label) => label.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [labels, searchTerm]);

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="labels_page">
      <section className="search_filter_section_labels sticky-section">
        {/* SEARCH */}
        <TextField
          label="Search label"
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
      <section className="labels_list_section">
        {loadingReleases ? (
          <div className="loader" />
        ) : (
          filteredLabels.map((label) => (
            <Link
              key={label.id}
              to={`/label/${label.id}`}
              state={{ labelName: label.name }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ItemCard key={label.id} item={label} imageBaseUrl={`${cloudinaryUrl}/jvm/labels`} />
            </Link>
          ))
        )}
      </section>
    </div>
  );
}

export default Labels;
