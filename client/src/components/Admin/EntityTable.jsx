/* eslint-disable react/prop-types */
// > ENTITY TABLE : artists & label //
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

function EntityTable({
  columns,
  data,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  renderRow,
  onView,
  onDelete,
}) {
  return (
    <>
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} align="center" sx={{ width: col.width }}>
                {col.label}
              </TableCell>
            ))}
            <TableCell align="center" sx={{ width: '10%' }}>
              ACTIONS
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {renderRow(item)}

              <TableCell align="center">
                <IconButton onClick={() => onView(item)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(item)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
}

export default EntityTable;
