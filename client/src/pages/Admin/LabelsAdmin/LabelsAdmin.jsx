/* eslint-disable consistent-return */
import { useEffect, useState, useMemo } from 'react';
import {
  TextField,
  Typography,
  TableCell,
  IconButton,
  CircularProgress,
  Button,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import EntityTable from '../../../components/Admin/EntityTable';
import EntityCreateModal from '../../../components/Admin/EntityCreateModal';
import EntityDetailModal from '../../../components/Admin/EntityDetailModal';
import DeleteConfirmDialog from '../../../components/Admin/DeleteConfirmDialog';
import AdminSnackbar from '../../../components/Admin/AdminSnackbar';
import useCrudEntity from '../../../hooks/useCrudEntity';
import '../adminPage.css';

function LabelsAdmin() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_BASE_URL;

  // --  CRUD via hook --//
  const {
    data: labels,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
  } = useCrudEntity({
    listEndpoint: '/api/label/admin',
    baseEndpoint: '/api/label',
  });

  // -- GLOBAL STATES -- //
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // -- CREATE STATES -- //
  const [openCreate, setOpenCreate] = useState(false);
  const [newLabel, setNewLabel] = useState({
    name: '',
    sorted_name: '',
    discogs_id: '',
    image_url: '',
  });
  const [previewNewImage, setPreviewNewImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [uploadingNew, setUploadingNew] = useState(false);

  // --  UPDATE / EDIT STATES --/
  const [openDetail, setOpenDetail] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedLabel, setEditedLabel] = useState({});
  const [previewEditImage, setPreviewEditImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --  DELETE STATES --//

  const [labelToDelete, setLabelToDelete] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // --  FETCHING EXTERNES STATES --//
  const [fetchingDiscogs, setFetchingDiscogs] = useState(false);

  // --  PAGINATION STATES --//

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --  SNACKBAR STATES --//

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  // ---------------------------
  //  FETCH LABEL
  // ---------------------------
  useEffect(() => {
    fetchAll();
  }, []);

  // ---------------------------
  //  FETCH FROM DISCOGS
  // ---------------------------
  const handleFetchFromDiscogs = async () => {
    if (!newLabel.discogs_id) return;

    try {
      setFetchingDiscogs(true);
      const res = await fetch(`${backendUrl}/api/label/discogs-preview/${newLabel.discogs_id}`);
      if (!res.ok) throw new Error('Erreur Discogs');

      const data = await res.json();

      setNewLabel((prev) => ({
        ...prev,
        name: data.name || '',
        sorted_name: data.sorted_name || '',
        image_url: data.image_url || '',
      }));

      if (data.image_url) setPreviewNewImage(data.image_url);
    } catch (err) {
      console.error(err);
      showSnackbar('Erreur récupération Discogs', 'error');
    } finally {
      setFetchingDiscogs(false);
    }
  };

  const handleFetchDiscogsForEdit = async () => {
    if (!editedLabel.discogs_id) return;

    try {
      setFetchingDiscogs(true);
      const res = await fetch(`${backendUrl}/api/label/discogs-preview/${editedLabel.discogs_id}`);
      if (!res.ok) throw new Error('Erreur Discogs');

      const data = await res.json();

      setEditedLabel((prev) => ({
        ...prev,
        name: data.name || prev.name,
        sorted_name: data.sorted_name || prev.sorted_name,
        discogs_image_url: data.image_url || prev.discogs_image_url,
      }));

      if (data.image_url) setPreviewEditImage(data.image_url);
    } catch (err) {
      console.error(err);
      showSnackbar('Erreur récupération Discogs', 'error');
    } finally {
      setFetchingDiscogs(false);
    }
  };

  // ---------------------------
  //  CREATE LABEL
  // ---------------------------
  const handleCreate = async () => {
    try {
      setUploadingNew(true);
      const formData = new FormData();
      formData.append('name', newLabel.name);
      formData.append('sorted_name', newLabel.sorted_name);
      formData.append('discogs_id', newLabel.discogs_id);

      if (newImageFile) formData.append('file', newImageFile);
      if (!newImageFile && newLabel.image_url?.startsWith('http')) {
        formData.append('discogs_image_url', newLabel.image_url);
      }

      await create(formData);
      showSnackbar('Label créé avec succès', 'success');

      setOpenCreate(false);
      setNewLabel({ name: '', sorted_name: '', discogs_id: '', image_url: '' });
      setPreviewNewImage(null);
      setNewImageFile(null);
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setUploadingNew(false);
    }
  };

  const handleNewImageUpload = (file) => {
    if (!file) return;
    setNewImageFile(file);
    setPreviewNewImage(URL.createObjectURL(file));
  };

  // ---------------------------
  //  UPDATE LABEL
  // ---------------------------
  const handleUpdate = async () => {
    if (!editedLabel) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('name', editedLabel.name);
      formData.append('sorted_name', editedLabel.sorted_name);
      if (editedLabel.discogs_id) formData.append('discogs_id', editedLabel.discogs_id);
      if (editedLabel.discogs_image_url && !newImageFile) {
        formData.append('discogs_image_url', editedLabel.discogs_image_url);
      }
      if (newImageFile) formData.append('file', newImageFile);

      const data = await update(editedLabel.id, formData);

      setEditedLabel((prev) => ({
        ...prev,
        image_url: data.image_filename || prev.image_url,
      }));

      setPreviewEditImage(null);
      setNewImageFile(null);
      setEditMode(false);
      showSnackbar('Label mis à jour', 'success');
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleEditImageUpload = (file) => {
    if (!file) return;
    setNewImageFile(file);
    setPreviewEditImage(URL.createObjectURL(file));
  };

  // ---------------------------
  //  DELETE LABEL
  // ---------------------------
  const handleDeleteConfirmed = async () => {
    try {
      await remove(labelToDelete.id);
      showSnackbar('Artiste supprimé', 'success');
      setConfirmOpen(false);
      setLabelToDelete(null);
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  // ---------------------------
  //  PAGINATION & FILTER
  // ---------------------------
  const filteredLabels = useMemo(
    () => labels.filter((a) => a.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [labels, searchTerm],
  );
  const paginatedLabels = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredLabels.slice(start, start + rowsPerPage);
  }, [filteredLabels, page, rowsPerPage]);

  // ---------------------------
  //  HELPERS IMAGE
  // ---------------------------
  const getLabelAvatarSrc = () => {
    if (previewNewImage) return previewNewImage;
    if (!newLabel.image_url) return `${cloudinaryUrl}/jvm/labels/00_label_default`;
    if (newLabel.image_url.startsWith('http')) return newLabel.image_url;
    return `${cloudinaryUrl}/jvm/labels/${newLabel.image_url}`;
  };

  const getEditLabelImageSrc = () => {
    if (previewEditImage) return previewEditImage;
    if (!editedLabel?.image_url) return `${cloudinaryUrl}/jvm/labels/00_label_default`;
    if (editedLabel.image_url.startsWith('http')) return editedLabel.image_url;
    return `${cloudinaryUrl}/jvm/labels/${editedLabel.image_url}?t=${Date.now()}`;
  };

  // ---------------------------
  //  RENDER
  // ---------------------------
  return (
    <main className="admin_page_main">
      <section className="adminTopSection">
        <Typography
          className="Title-adminTopSection"
          sx={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'var(--font-01)' }}
        >
          Admin Labels
        </Typography>
        <div className="Actions-adminTopSection">
          <TextField
            label="Rechercher un label"
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
          <Button
            variant="contained"
            sx={{ backgroundColor: 'var(--color-02)' }}
            onClick={() => setOpenCreate(true)}
          >
            Créer Label
          </Button>
        </div>
      </section>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <EntityTable
        columns={[
          { key: 'id', label: 'ID', width: '5%' },
          { key: 'avatar', label: '-', width: '5%' },
          { key: 'name', label: 'NOM', width: '35%' },
          { key: 'sorted_name', label: 'SORTED_N', width: '35%' },
          { key: 'release_count', label: 'RELEASES', width: '10%' },
        ]}
        data={paginatedLabels}
        totalCount={filteredLabels.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        renderRow={(label) => (
          <>
            <TableCell>{label.id}</TableCell>
            <TableCell>
              <Avatar src={`${cloudinaryUrl}/jvm/labels/${label.image_url}`} />
            </TableCell>
            <TableCell align="center">{label.name}</TableCell>
            <TableCell align="center">{label.sorted_name}</TableCell>
            <TableCell align="center">{label.release_count}</TableCell>
          </>
        )}
        onView={(label) => {
          setSelectedLabel(label);
          setEditedLabel({ ...label });
          setPreviewEditImage(null);
          setOpenDetail(true);
          setEditMode(false);
        }}
        onDelete={(label) => {
          setLabelToDelete(label);
          setConfirmOpen(true);
        }}
      />

      <EntityCreateModal
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setPreviewNewImage(null);
        }}
        onSubmit={handleCreate}
        title="Créer un label"
        formData={newLabel}
        setFormData={setNewLabel}
        getImageSrc={getLabelAvatarSrc}
        onImageUpload={handleNewImageUpload}
        onFetchExternal={handleFetchFromDiscogs}
        uploading={uploadingNew}
        fetching={fetchingDiscogs}
      />

      <EntityDetailModal
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setPreviewEditImage(null);
          setEditMode(false);
        }}
        title="Détails Label"
        entity={editedLabel}
        setEntity={setEditedLabel}
        editMode={editMode}
        setEditMode={setEditMode}
        getImageSrc={getEditLabelImageSrc}
        onEditImageUpload={handleEditImageUpload}
        onFetchExternal={handleFetchDiscogsForEdit}
        onSave={handleUpdate}
        uploading={uploading}
        fetching={fetchingDiscogs}
      />

      <DeleteConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirmed}
        entityName={labelToDelete?.name}
        label="le Label"
      />

      <AdminSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </main>
  );
}

export default LabelsAdmin;
