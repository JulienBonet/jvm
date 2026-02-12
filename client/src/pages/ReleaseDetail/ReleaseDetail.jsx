/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ReleaseDetail() {
  const { id } = useParams(); // récupère l'id depuis l'URL
  const [release, setRelease] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  console.info('releaseDetail', release);

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/release/${id}`);
        const data = await res.json();
        setRelease(data);
      } catch (err) {
        console.error('Erreur fetch release:', err);
      }
    };

    fetchRelease();
  }, [id]);

  if (!release) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/" style={{ marginBottom: '20px', display: 'inline-block' }}>
        ← Retour
      </Link>
      {release.cover?.length > 0 && (
        <img
          src={`${backendUrl}/images/${release.cover[0].image_url}`}
          alt={release.title}
          style={{ width: '200px', height: 'auto' }}
        />
      )}
      <h1>{release.title}</h1>
      <p>
        <strong>Année :</strong> {release.year || 'N/A'} <br />
        <strong>Pays :</strong> {release.country || 'N/A'} <br />
        <strong>Type :</strong> {release.release_type || 'N/A'} <br />
        <strong>Notes :</strong> {release.notes || 'N/A'} <br />
        <strong>taille :</strong> {release.tracks[0].size || 'N/A'} <br />
        <strong>vitesse :</strong>{' '}
        {release.tracks?.[0]?.speed ? `${release.tracks[0].speed}T` : 'N/A'}
      </p>

      {release.artists.length > 0 && (
        <div>
          <h3>Artistes</h3>
          <ul>
            {release.artists.map((a) => (
              <li key={a.id}>
                {a.name} ({a.role})
              </li>
            ))}
          </ul>
        </div>
      )}

      {release.labels.length > 0 && (
        <div>
          <h3>Labels</h3>
          <ul>
            {release.labels.map((l) => (
              <li key={l.id}>{l.name || 'N/A'}</li>
            ))}
          </ul>
        </div>
      )}

      {release.genres.length > 0 && (
        <div>
          <h3>Genres</h3>
          <ul>
            {release.genres.map((g) => (
              <li key={g.id}>{g.name}</li>
            ))}
          </ul>
        </div>
      )}

      {release.styles.length > 0 && (
        <div>
          <h3>Styles</h3>
          <ul>
            {release.styles.map((s) => (
              <li key={s.id}>{s.name}</li>
            ))}
          </ul>
        </div>
      )}

      {release.tracks.length > 0 && (
        <div>
          <h3>Pistes</h3>
          {release.tracks.map((t, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              <strong>
                Disc {t.disc_number} / {t.side} / {t.position}:
              </strong>{' '}
              {t.title} ({t.duration}s)
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReleaseDetail;
