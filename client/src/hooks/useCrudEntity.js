// > CRUD ENTITY : artists & label //
import { useState, useCallback } from 'react';

function useCrudEntity({ listEndpoint, baseEndpoint }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =======================
        FETCH ALL
  ======================= */
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${backendUrl}${listEndpoint}`);
      if (!res.ok) throw new Error('Erreur serveur');

      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, listEndpoint]);

  /* =======================
        CREATE
  ======================= */
  const create = async (formData) => {
    const res = await fetch(`${backendUrl}${baseEndpoint}`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Erreur création');

    await fetchAll();
    return res.json();
  };

  /* =======================
        UPDATE
  ======================= */
  const update = async (id, formData) => {
    const res = await fetch(`${backendUrl}${baseEndpoint}/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!res.ok) throw new Error('Erreur update');

    await fetchAll();
    return res.json();
  };

  /* =======================
        DELETE
  ======================= */
  const remove = async (id) => {
    const res = await fetch(`${backendUrl}${baseEndpoint}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Erreur suppression');

    await fetchAll();
  };

  return {
    data,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
}

export default useCrudEntity;
