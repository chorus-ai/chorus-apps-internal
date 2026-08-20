import { useState } from 'react'
import {
  Button,
  Table,
  TableBody,
  Typography,
  TableRow,
  Box,
  Dialog,
  IconButton,
  Collapse,
  Toolbar,
  styled,
  TableCell,
  Avatar as MuiAvatar,
  Stack,
  Tooltip,
  tableCellClasses,
} from '@mui/material'
import { MdExpandLess, MdExpandMore } from 'react-icons/md'
import { FaRobot } from 'react-icons/fa'
import { GoX } from 'react-icons/go'
import { MdOutlineLibraryAddCheck } from 'react-icons/md'
import {
  MdDriveFileRenameOutline,
  MdDeleteForever,
  MdSupervisorAccount,
} from 'react-icons/md'
import Avatar, { genConfig } from 'react-nice-avatar'
import { useNavigate } from 'react-router-dom'

import AddRoleDailog from './AddProjectUserDialog'
import AssignRecordsDailog from './AssignRecordsDialog'
import PopConfirm from '../../common/PopConfirm'
import EditUser from './EditUser'
import Label from '../../common/Label'
import { useAppSelector, useAppDispatch } from '../../../../hooks/redux'
import { impersonate } from '../../api/auth'
import type { User, ProjectWithRoles, ProjectUserRole } from '../../types'
import {
  useUserProjectRoles,
  useRemoveProjectUserRole,
} from '../../hooks'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

function UserRowCollapse({ open, row }: { open: boolean; row: User }) {
  const [addRoleOpen, setAddRoleOpen] = useState(false)
  const [assignRecordsOpen, setAssignRecordsOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<number | null>(null)

  const { roles } = useUserProjectRoles(row.id)
  const removeProjectUserRole = useRemoveProjectUserRole()

  const handleRemoveRoleClick = async (projectUser: ProjectUserRole) => {
    await removeProjectUserRole(projectUser)
  }

  return (
    <>
      {roles && (
        <Dialog open={addRoleOpen} onClose={() => setAddRoleOpen(false)} maxWidth="lg">
          <AddRoleDailog
            userId={row.id}
            userProjectRoles={roles as ProjectWithRoles[]}
            handleClose={() => setAddRoleOpen(false)}
          />
        </Dialog>
      )}

      {currentProject !== null && (
        <Dialog
          open={assignRecordsOpen}
          onClose={() => {
            setCurrentProject(null)
            setAssignRecordsOpen(false)
          }}
          maxWidth="lg"
        >
          <AssignRecordsDailog
            userId={row.id}
            projectId={currentProject}
            handleClose={() => {
              setCurrentProject(null)
              setAssignRecordsOpen(false)
            }}
          />
        </Dialog>
      )}

      <TableRow>
        <TableCell sx={{ pb: 2 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box m={2} display="flex" flexDirection="column">
              <Toolbar disableGutters>
                <Typography>Project roles</Typography>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={() => setAddRoleOpen(true)}>Add role</Button>
              </Toolbar>

              <Table size="small" aria-label="project roles">
                <TableBody>
                  {(roles as ProjectWithRoles[] | null)?.map((userProjectRole) => (
                    <StyledTableRow key={userProjectRole.id}>
                      <StyledTableCell component="th" scope="row">
                        {userProjectRole.name}
                      </StyledTableCell>

                      {['annotator', 'adjudicator'].map((role) => {
                        const projectUser = userProjectRole.cadaProjectUsers.find(
                          (user) => user.role === role
                        )

                        return (
                          <StyledTableCell key={role} align="right">
                            {projectUser ? (
                              <>
                                {projectUser.role}
                                <GoX
                                  style={{
                                    cursor: 'pointer',
                                    marginLeft: 5,
                                    marginBottom: -3,
                                    color: '#e74c3c',
                                  }}
                                  onClick={() => handleRemoveRoleClick(projectUser)}
                                />
                              </>
                            ) : (
                              '-'
                            )}
                          </StyledTableCell>
                        )
                      })}

                      <StyledTableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setCurrentProject(userProjectRole.id)
                            setAssignRecordsOpen(true)
                          }}
                        >
                          <MdOutlineLibraryAddCheck />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function UserTableRow({
  row,
  handleRemoveClick,
}: {
  row: User
  handleRemoveClick: (id: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((state) => state.main.user)

  const isAdmin =
    currentUser?.featureUsers &&
    Object.values(currentUser.featureUsers).some(
      (featureUser) => (featureUser as { role: string }).role === 'admin'
    )

  const handleImpersonate = async () => {
    try {
      const result = await impersonate(row.id)
      dispatch({ type: 'LOGIN', user: result.user })
      navigate('/features')
    } catch (error) {
      console.error('Impersonation failed:', error)
    }
  }

  return (
    <>
      {editUserOpen && (
        <EditUser
          userData={row}
          open={editUserOpen}
          handleClose={() => setEditUserOpen(false)}
        />
      )}

      <TableRow>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            {row.avatar ? (
              <MuiAvatar>
                <Avatar
                  style={{ width: '29px', height: '29px' }}
                  {...genConfig(JSON.parse(row.avatar))}
                />
              </MuiAvatar>
            ) : (
              <MuiAvatar
                sx={{ bgcolor: row.isBot ? 'success.main' : 'secondary.main' }}
              >
                {row.isBot ? (
                  <FaRobot size={15} color="white" />
                ) : (
                  `${row.firstName.charAt(0).toUpperCase()}${row.lastName
                    .charAt(0)
                    .toUpperCase()}`
                )}
              </MuiAvatar>
            )}

            <Typography variant="body2" noWrap>
              {row.firstName} {row.lastName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Label color={(row.featureUsers[0]?.role === 'user' && 'info') || 'success'}>
            {row.featureUsers[0]?.role}
          </Label>
        </TableCell>

        <TableCell>{row.username}</TableCell>
        <TableCell>{row.loginType}</TableCell>

        <TableCell>
          <IconButton
            color="info"
            size="small"
            onClick={() => setEditUserOpen(true)}
          >
            <MdDriveFileRenameOutline />
          </IconButton>

          <PopConfirm message="Are you sure, delete? " onConfirm={() => handleRemoveClick(row.id)}>
            <IconButton size="small" color="success">
              <MdDeleteForever />
            </IconButton>
          </PopConfirm>

          {isAdmin && currentUser?.id !== row.id && (
            <Tooltip title="Impersonate user">
              <IconButton size="small" color="warning" onClick={handleImpersonate}>
                <MdSupervisorAccount />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>

        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <MdExpandLess /> : <MdExpandMore />}
          </IconButton>
        </TableCell>
      </TableRow>

      {open && <UserRowCollapse open={open} row={row} />}
    </>
  )
}