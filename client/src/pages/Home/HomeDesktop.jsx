import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HomeDesktop() {
  const [releases, setReleases] = useState([]);
  console.info('releases', releases);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  // Fonction pour récupérer les releases depuis ton backend
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

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {releases.map((release) => (
          <Link
            key={release.id}
            to={`/release/${release.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                width: '200px',
              }}
            >
              {release.image_url && (
                <img
                  src={`${backendUrl}/images/${release.image_url}`}
                  alt={release.title}
                  style={{ width: '100%', height: 'auto' }}
                />
              )}
              <p>{release.artists || 'N/A'}</p>
              <h3 style={{ fontWeight: 'bold' }}>{release.title}</h3>
              <p>{release.labels || 'N/A'}</p>
              <p>{`size: ${release.disc_size || 'N/A'}`}</p>
              <p>{release.id || 'N/A'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomeDesktop;
