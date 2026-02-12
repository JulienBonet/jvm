import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Artists() {
  const [artists, setArtists] = useState([]);
  console.info('artists', artists);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  // Fonction pour récupérer les releases depuis ton backend
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

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {artists.map((artist) => (
          <Link
            key={artist.id}
            to={`/artist/${artist.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                width: '200px',
              }}
            >
              {artist.image_url && (
                <img
                  src={`${backendUrl}/images/${artist.image_url}`}
                  alt={artist.name}
                  style={{ width: '100%', height: 'auto' }}
                />
              )}
              <h3 style={{ fontWeight: 'bold' }}>{artist.name}</h3>
              <p>{artist.id || 'N/A'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Artists;
