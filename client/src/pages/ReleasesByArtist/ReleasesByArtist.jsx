import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ReleasesByArtist() {
  const { id } = useParams();
  const [releases, setReleases] = useState([]);
  console.info('releases', releases);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  // Fonction pour récupérer les releases depuis ton backend
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

  return (
    <div>
      <Link to="/artists" style={{ marginBottom: '20px', display: 'inline-block' }}>
        ← Retour
      </Link>
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

export default ReleasesByArtist;
