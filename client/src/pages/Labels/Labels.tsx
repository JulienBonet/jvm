import { useEffect, useState, useRef, useMemo } from 'react';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Link } from 'react-router-dom';
import ItemCard from '../../components/ItemCard/ItemCard';
import './label.css';
import { Label } from '../../types/entities/label.types';

function Labels() {
  // -- GLOBAL STATES -- //
  const [labels, setLabels] = useState<Label[]>([]);

  // -- SEARCH STATES -- //
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // -- LOADER STATES -- //
  const [loadingReleases, setLoadingReleases] = useState<boolean>(false);

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
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
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
