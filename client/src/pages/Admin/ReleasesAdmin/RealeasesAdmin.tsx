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
import ReleaseDetailDialogDesktop from '../../../components/ReleaseDetailDialogDesktop/ReleaseDetailDialogDesktop';
import EntityCreateModal from '../../../components/Admin/EntityCreateModal.jsx';
import EntityDetailModal from '../../../components/Admin/EntityDetailModal.jsx';
import DeleteConfirmDialog from '../../../components/Admin/DeleteConfirmDialog.jsx';
import AdminSnackbar from '../../../components/Admin/AdminSnackbar';
import { Release, ReleaseMDetail } from '../../../types/entities/release.types';
import '../adminPage.css';

function ReleasesAdmin() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_BASE_URL;

  // --  CRUD via hook --//
  //   const {
  //     data: artists,
  //     loading,
  //     error,
  //     fetchAll,
  //     create,
  //     update,
  //     remove,
  //   } = useCrudEntity<Artist>({
  //     listEndpoint: '/api/artist/admin',
  //     baseEndpoint: '/api/artist',
  //   });

  // -- GLOBAL STATES -- //
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<ReleaseMDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // -- CREATE STATES -- //
  const [openCreate, setOpenCreate] = useState(false);
  const [newRelease, setNewRelease] = useState({
    name: '',
    sorted_name: '',
    image_url: '',
    discogs_id: undefined,
  });
  const [previewNewImage, setPreviewNewImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [uploadingNew, setUploadingNew] = useState(false);

  // --  UPDATE / EDIT STATES --/
  const [originalRelease, setOriginalRelease] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRelease, setEditedRelease] = useState<Release | null>(null);
  const [previewEditImage, setPreviewEditImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // --  DELETE STATES --//

  const [releaseToDelete, setReleaseToDelete] = useState<Release | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // --  FETCHING EXTERNES STATES --//
  const [fetchingDiscogs, setFetchingDiscogs] = useState(false);

  // --  PAGINATION STATES --//

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --  SNACKBAR STATES --//

  type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message: string, severity: SnackbarSeverity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // ---------------------------
  //  FETCH RELEASE
  // ---------------------------
  const fetchReleases = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${backendUrl}/api/release`);

      if (!res.ok) throw new Error('Erreur serveur');

      const data = await res.json();
      setReleases(data);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les releases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchSelectedRelease = async (id : number) => {
  try {
    setLoadingDetail(true)

    const res = await fetch(`${backendUrl}/api/release/${id}`)

    if (!res.ok) throw new Error("Erreur serveur")

    const data = await res.json()

    setSelectedRelease(data)
    setOpenDetail(true)

  } catch (err) {
    console.error(err)
    showSnackbar("Erreur chargement release", "error")
  } finally {
    setLoadingDetail(false)
  }
}

  // ---------------------------
  //  FETCH FROM DISCOGS
  // ---------------------------
  //   const handleFetchFromDiscogs = async () => {
  //     if (!newArtist.discogs_id) return;

  //     try {
  //       setFetchingDiscogs(true);
  //       const res = await fetch(`${backendUrl}/api/artist/discogs-preview/${newArtist.discogs_id}`);
  //       if (!res.ok) throw new Error('Erreur Discogs');

  //       const data = await res.json();

  //       setNewArtist((prev) => ({
  //         ...prev,
  //         name: data.name || '',
  //         sorted_name: data.sorted_name || '',
  //         image_url: data.image_url || '',
  //       }));

  //       if (data.image_url) setPreviewNewImage(data.image_url);
  //     } catch (err) {
  //       console.error(err);
  //       showSnackbar('Erreur récupération Discogs', 'error');
  //     } finally {
  //       setFetchingDiscogs(false);
  //     }
  //   };

  //   const handleFetchDiscogsForEdit = async () => {
  //     if (!editedArtist?.discogs_id) return;

  //     try {
  //       setFetchingDiscogs(true);

  //       const res = await fetch(
  //         `${backendUrl}/api/artist/discogs-preview/${editedArtist.discogs_id}`,
  //       );
  //       if (!res.ok) throw new Error('Erreur Discogs');

  //       const discogsData = await res.json();

  //       setEditedArtist((prev) =>
  //         prev
  //           ? {
  //               ...prev,
  //               name: discogsData.name ?? prev.name,
  //               sorted_name: discogsData.sorted_name ?? prev.sorted_name,
  //               discogs_image_url: discogsData.image_url ?? prev.discogs_image_url,
  //             }
  //           : prev,
  //       );

  //       if (discogsData.image_url) {
  //         setPreviewEditImage(discogsData.image_url);
  //         setNewImageFile(null); // important
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       showSnackbar('Erreur récupération Discogs', 'error');
  //     } finally {
  //       setFetchingDiscogs(false);
  //     }
  //   };

  // ---------------------------
  //  CREATE RELEASE
  // ---------------------------
  //   const handleCreate = async () => {
  //     try {
  //      
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         showSnackbar(err.message, 'error');
  //       } else {
  //         showSnackbar('Erreur inconnue', 'error');
  //       }
  //     } finally {
  //       setUploadingNew(false);
  //     }
  //   };

  //   const handleNewImageUpload = (file: File | null) => {
  //     if (!file) return;
  //     setNewImageFile(file);
  //     setPreviewNewImage(URL.createObjectURL(file));
  //   };

  // ---------------------------
  //  UPDATE RELEASE
  // ---------------------------

  //   const startEdit = () => {
  //     setOriginalArtist(editedArtist);
  //     setEditMode(true);
  //   };

  //   const cancelEdit = () => {
  //     setEditedArtist(originalArtist);
  //     setPreviewEditImage(null);
  //     setNewImageFile(null);
  //     setEditMode(false);
  //   };

  //   const handleUpdate = async () => {
  //     try {
   //     } catch (err) {
  //     } finally {
  //       setUploading(false);
  //     }
  //   };

  //   const handleEditImageUpload = (file: File | null) => {
  //     if (!file) return;
  //     setNewImageFile(file);
  //     setPreviewEditImage(URL.createObjectURL(file));
  //   };

  // ---------------------------
  //  DELETE RELEASE
  // ---------------------------
  //   const handleDeleteConfirmed = async () => {
  //     if (!artistToDelete) return;
  //     try {
  //       await remove(artistToDelete.id);
  //       showSnackbar('Artiste supprimé', 'success');
  //       setConfirmOpen(false);
  //       setArtistToDelete(null);
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         showSnackbar(err.message, 'error');
  //       } else {
  //         showSnackbar('Erreur inconnue', 'error');
  //       }
  //     }
  //   };

  // ---------------------------
  //  PAGINATION & FILTER
  // ---------------------------
  const filteredReleases = useMemo(
    () => releases.filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [releases, searchTerm],
  );
  const paginatedReleases = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredReleases.slice(start, start + rowsPerPage);
  }, [filteredReleases, page, rowsPerPage]);

   /* =======================
     LINKS IN MODAL
  ======================= */
  const discogsLink = selectedRelease?.links?.find((link) => link.platform === 'discogs')?.url;

  // ---------------------------
  //  HELPERS IMAGE
  // ---------------------------
  //   const getArtistAvatarSrc = () => {
  //     if (previewNewImage) return previewNewImage;
  //     if (!newArtist.image_url) return `${cloudinaryUrl}/jvm/artists/00_artist_default`;
  //     if (newArtist.image_url.startsWith('http')) return newArtist.image_url;
  //     return `${cloudinaryUrl}/jvm/artists/${newArtist.image_url}`;
  //   };

  //   const getEditArtistImageSrc = () => {
  //     if (previewEditImage) return previewEditImage;
  //     if (editedArtist?.discogs_image_url) return editedArtist.discogs_image_url;
  //     if (!editedArtist?.image_url) return `${cloudinaryUrl}/jvm/artists/00_artist_default`;
  //     if (editedArtist.image_url.startsWith('http')) return editedArtist.image_url;
  //     return `${cloudinaryUrl}/jvm/artists/${editedArtist.image_url}?t=${Date.now()}`;
  //   };

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
          Admin Releases
        </Typography>
        <div className="Actions-adminTopSection">
          <TextField
            label="Rechercher un titre"
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
            Créer Release
          </Button>
        </div>
      </section>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <EntityTable
        columns={[
          { key: 'id', label: 'ID', width: '5%' },
          { key: 'cover', label: '-', width: '5%' },
          { key: 'title', label: 'TITRE', width: '30%' },
          { key: 'artiste', label: 'ARTISTE', width: '25%' },
          { key: 'type', label: 'TYPE', width: '4%' },
          { key: 'speed', label: 'SPEED', width: '4%' },
        ]}
        data={paginatedReleases}
        totalCount={filteredReleases.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_e: unknown, newPage: number) => setPage(newPage)}
        onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
        renderRow={(Release: Release) => (
          <>
            <TableCell sx={{ fontFamily: 'var(--font-02)', fontSize: 'medium' }} align="center">
              {Release.id}
            </TableCell>
            <TableCell sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={`${cloudinaryUrl}/jvm/releases/${Release.image_url}`}
                alt={Release.title}
                style={{ height: 60 }}
              />
            </TableCell>
            <TableCell sx={{ fontFamily: 'var(--font-02)', fontSize: 'medium' }} align="center">
              {Release.title}
            </TableCell>
            <TableCell sx={{ fontFamily: 'var(--font-02)', fontSize: 'medium' }} align="center">
              {Release.artists}
            </TableCell>
            <TableCell sx={{ fontFamily: 'var(--font-02)', fontSize: 'medium' }} align="center">
              {Release.release_type}
            </TableCell>
            <TableCell sx={{ fontFamily: 'var(--font-02)', fontSize: 'medium' }} align="center">
              {Release.disc_speed}
            </TableCell>
          </>
        )}
        onView={(release: Release) => {
          fetchSelectedRelease(release.id)
          console.info('Release select on view btn:', release);
        }}
        onDelete={(release: Release) => {
          //   setArtistToDelete(artist);
          //   setConfirmOpen(true);
          console.info('Release select on delete btn:', release);
        }}
      />

      <ReleaseDetailDialogDesktop
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        releaseDetail={selectedRelease}
        loadingDetail={loadingDetail}
        imageBaseUrl={`${cloudinaryUrl}/jvm/releases`}
        discogsLink={discogsLink}
      />

      {/* <DeleteConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirmed}
        entityName={artistToDelete?.name}
        label="l’artiste"
      /> */}

      <AdminSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </main>
  );
}

export default ReleasesAdmin;
