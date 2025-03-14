//make table component reusable

import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  styled,
  alpha,
  tableCellClasses,
} from "@mui/material";
import PropTypes from "prop-types";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.common.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.secondary.light, 0.1),
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: "solid 1",
  },
}));

export const CommonTable = ({ headers, data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <StyledTableCell key={index}>{header}</StyledTableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <StyledTableRow key={index}>
            {Object.values(row).map((value, index) => (
              <StyledTableCell key={index}>{value}</StyledTableCell>
            ))}
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  );
};

CommonTable.propTypes = {
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};
