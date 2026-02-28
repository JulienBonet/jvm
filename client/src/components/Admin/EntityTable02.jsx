/* eslint-disable react/prop-types */
// > ENTITY TABLE : Genres & Styles //
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

function EntityTable02({
  data,
  handleOpen,
  handleOpenConfirm,
  filteredItems,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
}) {
  return (
    <>
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
          {data.map((genre) => (
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
        count={filteredItems.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </>
  );
}

export default EntityTable02;
