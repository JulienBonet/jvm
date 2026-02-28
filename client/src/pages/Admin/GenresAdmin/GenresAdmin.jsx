import { useEffect, useState, useMemo } from 'react';
import { TextField, Typography, IconButton, CircularProgress, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import EntityTable from '../../../components/Admin/EntityTable02';
import EntityCreateModal from '../../../components/Admin/EntityCreateModal02';
import EntityDetailModal from '../../../components/Admin/EntityDetailModal02';
import DeleteConfirmDialog from '../../../components/Admin/DeleteConfirmDialog';
import AdminSnackbar from '../../../components/Admin/AdminSnackbar';
import '../adminPage.css';

function GenresAdmin() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // states create genre
  const [openCreate, setOpenCreate] = useState(false);
  const [newGenre, setNewGenre] = useState('');
  // states update genre
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  // states delete genre
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);
  // states pour pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // states snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  /* =======================
     GESTION SNACKBAR
  ======================= */

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  /* =======================
     FETCH
  ======================= */

  const fetchGenres = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${backendUrl}/api/genre/orderbyid`);

      if (!res.ok) throw new Error('Erreur serveur');

      const data = await res.json();
      setGenres(data);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les genres.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  /* =======================
     DELETE
  ======================= */

  const handleOpenConfirm = (genre) => {
    setGenreToDelete(genre);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/api/genre/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erreur suppression');

      showSnackbar(`Genre supprimé !`, 'success');
      fetchGenres();
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || 'Impossible de supprimer le genre.', 'error');
    }
  };

  /* =======================
     CREATE 
  ======================= */

  const handleCreate = async () => {
    if (!newGenre.trim()) return;

    try {
      const res = await fetch(`${backendUrl}/api/genre`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newGenre }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erreur save');

      showSnackbar(`Genre "${newGenre}" créé avec succès !`, 'success');
      setNewGenre('');
      setOpenCreate(false);
      fetchGenres(); // refresh automatique
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  /* =======================
     UPDATE
  ======================= */
  const handleOpen = (genre) => {
    setSelectedGenre(genre);
    setEditedName(genre.name);
    setEditMode(false);
    setOpenDetail(true);
  };

  const handleUpdate = async () => {
    if (!editedName.trim()) return;

    try {
      const res = await fetch(`${backendUrl}/api/genre/${selectedGenre.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editedName }),
      });

      const data = await res.json(); // récupère le message du backend

      if (!res.ok) throw new Error(data.message || 'Erreur update');

      fetchGenres();
      setSelectedGenre((prev) => ({ ...prev, name: editedName }));
      setEditMode(false);
      showSnackbar(`Genre mis à jour en "${editedName}" !`, 'success');
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || 'Impossible de modifier le genre.', 'error');
    }
  };

  /* =======================
     FILTRAGE + PAGINATION
  ======================= */
  const filteredGenres = useMemo(() => {
    return genres.filter((style) => style.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [genres, searchTerm]);

  const paginatedGenres = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredGenres.slice(start, start + rowsPerPage);
  }, [filteredGenres, page, rowsPerPage]);

  /* =======================
     RENDER
  ======================= */

  return (
    <main className="admin_page_main">
      <section className="adminTopSection">
        <Typography
          className="Title-adminTopSection"
          sx={{
            fontSize: 24,
            fontWeight: 'bold',
            fontFamily: 'var(--font-01)',
          }}
        >
          Admin Genres
        </Typography>
        <div className="Actions-adminTopSection">
          {/* searchbar */}
          <TextField
            label="Rechercher un genre"
            variant="outlined"
            size="small"
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <CloseIcon />
                </IconButton>
              ),
            }}
            sx={{ width: 300 }}
          />
          {/* create BTN */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'var(--color-02)',
            }}
            onClick={() => setOpenCreate(true)}
          >
            Créer Genre
          </Button>
        </div>
      </section>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <EntityTable
        data={paginatedGenres}
        handleOpen={handleOpen}
        handleOpenConfirm={handleOpenConfirm}
        filteredItems={filteredGenres}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

      <EntityCreateModal
        open={openCreate}
        title="Créer un genre"
        label="Nom du genre"
        newValue={newGenre}
        setOpenCreate={setOpenCreate}
        setNewValue={setNewGenre}
        handleCreate={handleCreate}
      />

      <EntityDetailModal
        open={openDetail}
        setOpenDetail={setOpenDetail}
        title="Genre Details"
        label="Nom du genre"
        editMode={editMode}
        selectedItem={selectedGenre}
        editedName={editedName}
        setEditedName={setEditedName}
        setEditMode={setEditMode}
        handleUpdate={handleUpdate}
      />

      <DeleteConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          handleDeleteConfirmed(genreToDelete.id);
          setConfirmOpen(false);
        }}
        entityName={genreToDelete?.name}
        label="le genre"
      />

      <AdminSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </main>
  );
}

export default GenresAdmin;
