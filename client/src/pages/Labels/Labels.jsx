import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Labels() {
  const [labels, setLabels] = useState([]);
  console.info('labels', labels);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  // Fonction pour récupérer les releases depuis ton backend
  const fetchLabels = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/label`);
      const data = await res.json();
      setLabels(data);
    } catch (err) {
      console.error('Erreur fetch Labels:', err);
    }
  };

  // useEffect pour charger les données au montage
  useEffect(() => {
    fetchLabels();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {labels.map((label) => (
          <Link
            key={label.id}
            to={`/label/${label.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                width: '200px',
              }}
            >
              {label.image_url && (
                <img
                  src={`${backendUrl}/images/${label.image_url}`}
                  alt={label.name}
                  style={{ width: '100%', height: 'auto' }}
                />
              )}
              <h3 style={{ fontWeight: 'bold' }}>{label.name}</h3>
              <p>{label.id || 'N/A'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Labels;
