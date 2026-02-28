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
import EntityTable from '../../../components/Admin/EntityTable02';
import EntityCreateModal from '../../../components/Admin/EntityCreateModal02';
import EntityDetailModal from '../../../components/Admin/EntityDetailModal02';
import DeleteConfirmDialog from '../../../components/Admin/DeleteConfirmDialog';
import AdminSnackbar from '../../../components/Admin/AdminSnackbar';
import '../adminPage.css';

function StylesAdmin() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [styles, setStyles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // states create genre
  const [openCreate, setOpenCreate] = useState(false);
  const [newStyle, setNewStyle] = useState('');
  // states update genre
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  // states delete genre
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [styleToDelete, setStyleToDelete] = useState(null);
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

  const fetchStyles = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${backendUrl}/api/style/orderbyid`);

      if (!res.ok) throw new Error('Erreur serveur');

      const data = await res.json();
      setStyles(data);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les styles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  /* =======================
     DELETE
  ======================= */

  const handleOpenConfirm = (style) => {
    setStyleToDelete(style);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/api/style/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erreur suppression');

      showSnackbar(`Style supprimé !`, 'success');
      fetchStyles();
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || 'Impossible de supprimer le style.', 'error');
    }
  };

  /* =======================
     CREATE 
  ======================= */

  const handleCreate = async () => {
    if (!newStyle.trim()) return;

    try {
      const res = await fetch(`${backendUrl}/api/style`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newStyle }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erreur save');

      showSnackbar(`Genre "${newStyle}" créé avec succès !`, 'success');
      setNewStyle('');
      setOpenCreate(false);
      fetchStyles(); // refresh automatique
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  /* =======================
     UPDATE
  ======================= */
  const handleOpen = (style) => {
    setSelectedStyle(style);
    setEditedName(style.name);
    setEditMode(false);
    setOpenDetail(true);
  };

  const handleUpdate = async () => {
    if (!editedName.trim()) return;

    try {
      const res = await fetch(`${backendUrl}/api/style/${selectedStyle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editedName }),
      });

      const data = await res.json(); // récupère le message du backend

      if (!res.ok) throw new Error(data.message || 'Erreur update');

      fetchStyles();
      setSelectedStyle((prev) => ({ ...prev, name: editedName }));
      setEditMode(false);
      showSnackbar(`Genre mis à jour en "${editedName}" !`, 'success');
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || 'Impossible de modifier le style.', 'error');
    }
  };

  /* =======================
     FILTRAGE + PAGINATION
  ======================= */

  const filteredStyles = useMemo(() => {
    return styles.filter((style) => style.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [styles, searchTerm]);

  const paginatedStyles = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredStyles.slice(start, start + rowsPerPage);
  }, [filteredStyles, page, rowsPerPage]);

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
          Admin Styles
        </Typography>
        <div className="Actions-adminTopSection">
          {/* searchbar */}
          <TextField
            label="Rechercher un style"
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
            Créer style
          </Button>
        </div>
      </section>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <EntityTable
        data={paginatedStyles}
        handleOpen={handleOpen}
        handleOpenConfirm={handleOpenConfirm}
        filteredItems={filteredStyles}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

      <EntityCreateModal
        open={openCreate}
        title="Créer un Style"
        label="Nom du Style"
        newValue={newStyle}
        setOpenCreate={setOpenCreate}
        setNewValue={setNewStyle}
        handleCreate={handleCreate}
      />

      <EntityDetailModal
        open={openDetail}
        setOpenDetail={setOpenDetail}
        title="Style Details"
        label="Nom du style"
        editMode={editMode}
        selectedItem={selectedStyle}
        editedName={editedName}
        setEditedName={setEditedName}
        setEditMode={setEditMode}
        handleUpdate={handleUpdate}
      />

      <DeleteConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          handleDeleteConfirmed(styleToDelete.id);
          setConfirmOpen(false);
        }}
        entityName={styleToDelete?.name}
        label="le style"
      />

      <AdminSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </main>
  );
}

export default StylesAdmin;
