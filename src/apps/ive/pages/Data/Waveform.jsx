import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  TableCell, 
  Paper,
  Icon,
  AppBar,
  Grid,
  InputBase,
  FormControl,
  Container,
  Stack, 
  IconButton, 
  Button
} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import { tableCellClasses } from '@mui/material/TableCell';
import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";
import { MdOutlineWidthWide, MdFilterList } from "react-icons/md";
import Tile from "../../sections/Dashboard/Tile";

import axios from "axios";
import { FaEye } from "react-icons/fa";

// ----------------------------------------------------------------------

const Search = styled(FormControl)(({ theme }) => ({
  position: "relative",
  fontSize: theme.typography.fontSize,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  display: "flex",
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

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
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.secondary.light, 0.10),
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 'solid 1',
  },
}));


const WaveformTable = () => {
  const [searchKey, setSearchKey] = React.useState('');
  const [data, setData] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [fullWidth, setFullWidth] = React.useState(false);
  const [open, setOpen] = useState(false);

  const [dialogContent, setDialogContent] = useState('');


  const handleClickOpen = (data) => {
    setDialogContent(`Waveform path: ${data} `);
    setOpen(true);
};

const handleClose = () => {
    setOpen(false);
};


  const waveformData = [
    {
      "person_id": 101,
      "start_date": "2024-11-01",
      "duration": "00:30:00",
      "waveform_path": "/data/waveforms/patient101_session1.adibin"
    },
    {
      "person_id": 102,
      "start_date": "2024-11-02",
      "duration": "01:00:00",
      "waveform_path": "/data/waveforms/patient102_session1.adibin"
    },
    {
      "person_id": 103,
      "start_date": "2024-11-03",
      "duration": "00:45:00",
      "waveform_path": "/data/waveforms/patient103_session1.adibin"
    },
    {
      "person_id": 104,
      "start_date": "2024-11-04",
      "duration": "00:50:00",
      "waveform_path": "/data/waveforms/patient104_session1.adibin"
    },
    {
      "person_id": 105,
      "start_date": "2024-11-05",
      "duration": "01:15:00",
      "waveform_path": "/data/waveforms/patient105_session1.adibin"
    }
  ]

  const handleSearch = (event) => {
    setSearchKey(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  }

  const handleRowsPerPageChange = (event) => {
    setPageSize(event.target.value);
  }

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/omop/person?page=${page}&pageSize=${pageSize}`,
    }).then((res) => res.data)
    .then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (searchKey === "" || searchKey === 0) {
      axios({
        method: "get",
        url: `/api/omop/person?page=${page}&pageSize=${pageSize}`,
      }).then((res) => res.data)
      .then((data) => {
        setData(data);
      });
    } else {
      axios({
        method: "get",
        url: `/api/omop/person/concept/${searchKey}`,
      }).then((res) => res.data)
      .then((data) => {
        setData(data);
      });
    }
   
  }, [page, pageSize, searchKey]);

  return (
    <Container maxWidth={fullWidth ? "fullWidth" : "xl"}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AppBar
            sx={{ bgcolor: "rgba(0, 0, 0, 0)", mt: 7, mb: 3, pr: 1 }}
            position="static"
            color="inherit"
            elevation={0}
          >
            <Grid container alignItems="center">
              <Grid item xs>
                <Search>
                  <SearchIconWrapper>
                    <BiSearchAlt />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search with string"
                    value={searchKey}
                    onChange={handleSearch}
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={1}>
                  <Icon>
                    <MdFilterList />
                  </Icon>
                  <Icon onClick={() => setFullWidth(!fullWidth)}>
                    <MdOutlineWidthWide />
                  </Icon>
                </Stack>
              </Grid>
            </Grid>
          </AppBar>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose } fullWidth={true} maxWidth="xl">
                <DialogTitle>{"Waveform "}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Tile />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>


      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
            <StyledTableCell>wavefom_id</StyledTableCell>
            <StyledTableCell>person_id</StyledTableCell>
            <StyledTableCell>start_date</StyledTableCell>
            <StyledTableCell>duration</StyledTableCell>
            <StyledTableCell>waveform_path</StyledTableCell>
            <StyledTableCell>Detail</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
          {data && waveformData &&
            waveformData.map((row, index) => (
                <StyledTableRow key={index}>
                <StyledTableCell>{index}</StyledTableCell>
                <StyledTableCell>{data[index].person_id}</StyledTableCell>
                <StyledTableCell>{row.start_date}</StyledTableCell>
                <StyledTableCell>{row.duration}</StyledTableCell>
                <StyledTableCell>{row.waveform_path}</StyledTableCell>
                <StyledTableCell>
                <IconButton onClick={() => handleClickOpen(row.waveform_path)}>
                  <FaEye />
                </IconButton>
              </StyledTableCell>
                </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={waveformData.length}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    </Container>
  );
};

export default WaveformTable;
