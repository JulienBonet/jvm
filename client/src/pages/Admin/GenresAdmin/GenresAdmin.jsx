import { useEffect, useState, useMemo } from 'react';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TablePagination,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import '../adminPage.css';

function GenresAdmin() {
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

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '10%' }} align="center">
              ID
            </TableCell>
            <TableCell sx={{ width: '80%' }} align="center">
              NOM
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="center">
              ACTIONS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedGenres.map((genre) => (
            <TableRow key={genre.id}>
              <TableCell sx={{ fontFamily: 'var(--font-02)', fontSize: 'medium' }} align="center">
                {genre.id}
              </TableCell>
              <TableCell sx={{ fontFamily: 'var(--font-02)', fontSize: 'medium' }} align="center">
                {genre.name}
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleOpen(genre)}>
                  <VisibilityIcon sx={{ color: 'var(--color-03)' }} />
                </IconButton>
                <IconButton color="error" onClick={() => handleOpenConfirm(genre)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filteredGenres.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />

      {/* MODAL CREATE */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Créer un genre</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du genre"
            fullWidth
            variant="outlined"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button color="var(--color-02)" onClick={() => [setOpenCreate(false), setNewGenre('')]}>
            Annuler
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'var(--color-02)',
            }}
            onClick={handleCreate}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
      {/* END MODAL CREATE */}

      {/* MODAL DETAILS */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Genre Details</DialogTitle>

        <DialogContent dividers>
          {!editMode ? (
            <>
              <Typography variant="subtitle2">ID</Typography>
              <Typography sx={{ mb: 2 }}>{selectedGenre?.id}</Typography>

              <Typography variant="subtitle2">Nom</Typography>
              <Typography>{selectedGenre?.name}</Typography>
            </>
          ) : (
            <TextField
              label="Nom du genre"
              fullWidth
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          )}
        </DialogContent>

        <DialogActions>
          {!editMode ? (
            <>
              <Button onClick={() => setOpenDetail(false)}>Fermer</Button>
              <Button variant="contained" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditMode(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleUpdate}>
                Save
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      {/* END MODAL DETAILS */}

      {/* ALERT - SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* END ALERT - SNACKBAR */}

      {/* DELETE ALERT */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Supprimer le genre `{genreToDelete?.name}` ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="var(--color-02)" onClick={() => setConfirmOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteConfirmed(genreToDelete.id);
              setConfirmOpen(false);
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      {/* END DELETE ALERT */}
    </main>
  );
}

export default GenresAdmin;
