import { useEffect, useState } from "react";
import {
  Typography,
  TableRow,
  Dialog,
  IconButton,
  styled,
  TableCell,
  Avatar as MuiAvatar,
  Stack,
  tableCellClasses,
} from "@mui/material";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import AddRoleDailog from "./AddProjectUserDialog";
import { useSelector, useDispatch } from "react-redux";
import AssignRecordsDailog from "./AssignRecordsDialog";
import Avatar, { genConfig } from "react-nice-avatar";
import {
  MdDriveFileRenameOutline,
  MdDeleteForever,
  MdMoreVert,
} from "react-icons/md";
import PopConfirm from "../../../../common/PopConfirm";
import axios from "axios";
import EditUser from "./EditUser";

// ----------------------------------------------------------------------

async function removeProjectRole(projectId, userId, role) {
  console.log(`/api/cada/projects/${projectId}/users/${userId}?role=${role}`);
  return fetch(`/api/cada/projects/${projectId}/users/${userId}?role=${role}`, {
    method: "DELETE",
    mode: "cors", //include this to fetch without body
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((data) => data.json());
}

// ----------------------------------------------------------------------

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// ----------------------------------------------------------------------

export default function UserRow({ row, handleRemoveClick }) {
  const [open, setOpen] = useState(false);
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [assignRecordsOpen, setAssignRecordsOpen] = useState(false);

  const dispatch = useDispatch();

  const userProjectRoles = useSelector((state) =>
    state.cada.userProjectRoles[row.id]
      ? state.cada.userProjectRoles[row.id]
      : null
  );

  const user = useSelector((state) => state.main.user);

  const handleAddRoleClick = () => {
    setAddRoleOpen(true);
  };
  const handleAddRoleClose = () => {
    setAddRoleOpen(false);
  };

  const handleAssignRecordsClick = () => {
    setAssignRecordsOpen(true);
  };
  const handleAssignRecordsClose = () => {
    setAssignRecordsOpen(false);
  };

  const handleConfirmDelete = () => {
    handleRemoveClick(row.id);
  };

  const handleEditUser = () => {
    setEditUserOpen(false);
  };

  const handleRemoveRoleClick = async (pUser) => {
    const userRole = await removeProjectRole(
      pUser.cadaProjectId,
      pUser.userId,
      pUser.role
    );
    if (userRole) {
      let userProjects = [];
      let project = userProjectRoles.find(
        (project) => project.id === parseInt(pUser.cadaProjectId, 10)
      );
      if (project) {
        userProjects = userProjectRoles.map((p) =>
          p.id === parseInt(pUser.cadaProjectId, 10)
            ? {
                ...p,
                cadaProjectUsers: p.cadaProjectUsers.filter(
                  (u) => u.id !== pUser.id
                ),
              }
            : p
        );
      }
      dispatch({
        type: "ADD_PROJECT_USER",
        userId: pUser.userId,
        payload: userProjects,
      });
    }
  };

  useEffect(() => {
    if (userProjectRoles === null) {
      axios({
        method: "get",
        url: `/api/cada/projects/users/${row.id}`,
      }).then((res) => {
        dispatch({
          type: "ADD_PROJECT_USER",
          userId: row.id,
          payload: res.data,
        });
      });
    }
  }, [row, userProjectRoles]);

  let annotatorProjects = [];

  return (
    <>
      {userProjectRoles && (
        <Dialog
          open={addRoleOpen}
          onClose={handleAddRoleClose}
          maxWidth={"lg"}
          aria-labelledby="form-dialog-title"
        >
          <AddRoleDailog
            userId={row.id}
            userProjectRoles={userProjectRoles}
            handleClose={handleAddRoleClose}
          />
        </Dialog>
      )}

      <Dialog
        open={assignRecordsOpen}
        onClose={handleAssignRecordsClose}
        maxWidth={"lg"}
        aria-labelledby="form-dialog-title"
      >
        <AssignRecordsDailog
          userId={row.id}
          projects={annotatorProjects}
          handleClose={handleAssignRecordsClose}
        />
      </Dialog>

      {editUserOpen && (
        <EditUser
          userData={row}
          open={editUserOpen}
          handleClose={handleEditUser}
        />
      )}

      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <MdExpandLess /> : <MdExpandMore />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            {row.avatar ? (
              <MuiAvatar>
                <Avatar
                  style={{ width: "29px", height: "29px" }}
                  {...genConfig(JSON.parse(row.avatar))}
                />
              </MuiAvatar>
            ) : (
              <MuiAvatar sx={{ bgcolor: "secondary.main" }}>
                {row.firstName.charAt(0).toUpperCase() +
                  row.lastName.charAt(0).toUpperCase()}
              </MuiAvatar>
            )}
            <Typography variant="body2" noWrap>
              {row.firstName + " " + row.lastName}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{row.username} </TableCell>
        <TableCell>{row.loginType} </TableCell>
        <TableCell>
          {row.featureUsers[0] ? row.featureUsers[0].role : null}
        </TableCell>
        <TableCell>
          <MdDriveFileRenameOutline
            fontSize="small"
            sx={{ cursor: "pointer", color: "info.main" }}
            onClick={() => setEditUserOpen(!editUserOpen)}
          />
          <PopConfirm
            message="Are you sure, delete? "
            onConfirm={handleConfirmDelete}
          >
            <MdDeleteForever
              fontSize="small"
              sx={{ cursor: "pointer", color: "success.main", ml: 1 }}
            />
          </PopConfirm>
        </TableCell>
        <TableCell>
          <MdMoreVert sx={{ cursor: "pointer", ml: 1, color: "grey" }} />
        </TableCell>
      </TableRow>
    </>
  );
}
