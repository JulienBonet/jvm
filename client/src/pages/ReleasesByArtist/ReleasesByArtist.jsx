import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import ReleaseCard from '../../components/ReleaseCard/ReleaseCard';
import './releasesByArtist.css';

function ReleasesByArtist() {
  const { id } = useParams();
  const [releases, setReleases] = useState([]);
  // filter states
  const [discFilter, setDiscFilter] = useState('ALL');
  const [alphaOrder, setAlphaOrder] = useState(null);
  const [yearOrder, setYearOrder] = useState(null);
  console.info('releases', releases);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  /* =======================
     FETCH RELEASES
  ======================= */
  const fetchReleasesByArtist = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/artist/${id}/releases`);
      const data = await res.json();
      setReleases(data);
    } catch (err) {
      console.error('Erreur fetch releases:', err);
    }
  };

  // useEffect pour charger les données au montage
  useEffect(() => {
    fetchReleasesByArtist();
  }, []);

  /* =======================
     RESET
  ======================= */

  const handleReset = () => {
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
    <div className="releases_by_artist">
      <section className="search_filter_section_releases_artist sticky-section">
        <Link to="/artists">
          <SubdirectoryArrowLeftIcon />
        </Link>

        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          {releases[0]?.artists || 'N/A'}
        </Typography>

        <div className="filter_btn_releases_artists">
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

          {/* ALPHABETICAL - CHRONOLOGICAL */}
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
        </div>
      </section>
      <section className="releases_list_section_releases_artist">
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

export default ReleasesByArtist;
