import { useEffect, useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';

import { ReleaseMDetail } from '../../types/entities/release.types';

interface Props {
  releaseDetail: ReleaseMDetail | null;
  imageBaseUrl: string;
  onCancel: () => void;
  onUpdated: () => void;
}

function ReleaseEditForm({ releaseDetail, onCancel, onUpdated }: Props) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');

  console.info("title", title)

  // 🧠 PREFILL (IMPORTANT)
  useEffect(() => {
    if (!releaseDetail) return;

    setTitle(releaseDetail.title || '');
    setYear(releaseDetail.year ? String(releaseDetail.year) : '');
  }, [releaseDetail]);

  const handleSubmit = async () => {
    if (!releaseDetail) return;

    try {
      const formData = new FormData();

      // champs simples
      if (title !== releaseDetail.title) formData.append('title', title);
      if (year !== String(releaseDetail.year)) formData.append('year', year);

      // artistes / labels / genres / styles / links
      // n'envoyer que si tu modifies
      // ex : formData.append('artists', JSON.stringify(updatedArtists));

      // image
      // si utilisateur upload un fichier
      // formData.append('file', file);

      console.info('formData', formData);

      const response = await fetch(`${backendUrl}/api/release/${releaseDetail.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Update failed');
      

      onUpdated();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Edit Release</Typography>

      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

      <TextField label="Year" value={year} onChange={(e) => setYear(e.target.value)} />

      <Stack direction="row" spacing={2}>
        <Button onClick={onCancel}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </Stack>
    </Stack>
  );
}

export default ReleaseEditForm;
