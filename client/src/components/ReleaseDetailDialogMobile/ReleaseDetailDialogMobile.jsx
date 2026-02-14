/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  CircularProgress,
  Divider,
  IconButton,
  Box,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';

function ReleaseDetailDialogMobile({ open, onClose, releaseDetail, loadingDetail, backendUrl }) {
  const discogsLink = releaseDetail?.links?.find((link) => link.platform === 'discogs')?.url;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {releaseDetail?.title}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loadingDetail && <CircularProgress />}

        {!loadingDetail && releaseDetail && (
          <>
            {/* Cover */}
            {releaseDetail.cover?.[0]?.image_url && (
              <img
                src={`${backendUrl}/images/${releaseDetail.cover[0].image_url}`}
                alt={releaseDetail.title}
                style={{ width: '100%', marginBottom: 16 }}
              />
            )}

            <Typography gutterBottom>
              <Typography component="span" fontWeight="bold">
                Artistes:
              </Typography>{' '}
              {releaseDetail.artists.map((a) => a.name).join(', ')}
            </Typography>

            <Typography gutterBottom>
              <Typography component="span" fontWeight="bold">
                Labels:
              </Typography>{' '}
              {releaseDetail.labels.map((l) => `${l.name} (${l.catalog_number})`).join(', ')}
            </Typography>

            {releaseDetail.genres && (
              <Typography gutterBottom>
                <Typography component="span" fontWeight="bold">
                  Genres:
                </Typography>{' '}
                {releaseDetail.genres.map((g) => g.name).join(', ')}
              </Typography>
            )}

            {releaseDetail.styles?.length > 0 && (
              <Typography gutterBottom>
                <Typography component="span" fontWeight="bold">
                  Styles:
                </Typography>{' '}
                {releaseDetail.styles.map((s) => s.name).join(', ')}
              </Typography>
            )}

            {releaseDetail.year > 0 && (
              <Typography gutterBottom>
                <Typography component="span" fontWeight="bold">
                  Année:
                </Typography>{' '}
                {releaseDetail.year}
              </Typography>
            )}

            {releaseDetail.country && (
              <Typography gutterBottom>
                <Typography component="span" fontWeight="bold">
                  Pays:
                </Typography>{' '}
                {releaseDetail.country}
              </Typography>
            )}

            {releaseDetail.barcode && (
              <Typography gutterBottom>
                <Typography component="span" fontWeight="bold">
                  Barcode:
                </Typography>{' '}
                {releaseDetail.barcode}
              </Typography>
            )}

            {/* Tracklist */}
            {releaseDetail.tracks && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Tracklist
                </Typography>
                {releaseDetail.tracks.map((track) => (
                  <Typography key={`${track.disc_number}-${track.position}`} variant="body2">
                    {track.position} - {track.title}
                  </Typography>
                ))}{' '}
              </>
            )}

            {releaseDetail.notes && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {releaseDetail.notes}
                </Typography>
              </>
            )}

            {discogsLink && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<LaunchIcon />}
                    onClick={() => window.open(discogsLink, '_blank')}
                  >
                    Voir sur Discogs
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ReleaseDetailDialogMobile;
