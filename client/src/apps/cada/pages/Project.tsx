import { useMemo, useState } from 'react'
import {
  AppBar,
  Grid,
  Button,
  Dialog,
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Chip,
  Toolbar,
  Tabs,
  Tab,
  InputBase,
  FormControl,
  Box,
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import { BiSearchAlt } from 'react-icons/bi'
import { MdExpandMore, MdMoreVert } from 'react-icons/md'
import AddForm from '../sections/Project/AddProjectDialog'
import AssignEventDialog from '../sections/Project/AssignFilesDialog'
import Detail from '../sections/Project/Detail'
import { useProjects, useEventCounts } from '../hooks'
import type { Project as ProjectType } from '../types'
import { PlusIcon } from '../common/Icons'

type ExpandMoreProps = {
  expand: boolean
}

type ProjectButton = {
  name: string
  value: string
  color: string
}

const ExpandMore = styled(
  ({ expand, ...other }: ExpandMoreProps & React.ComponentProps<typeof IconButton>) => (
    <IconButton {...other} />
  )
)(({ theme, expand }) => ({
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

const Search = styled(FormControl)(({ theme }) => ({
  position: 'relative',
  fontSize: theme.typography.fontSize,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  display: 'flex',
  width: '100%',
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))

interface ProjectCardProps {
  card: ProjectType
  handleProjectDetailClick: (id: number) => void
  handleNeedEventsClick: (id: number) => void
}

const parseButtons = (attributes?: string): ProjectButton[] => {
  if (!attributes) return []

  try {
    const parsed = JSON.parse(attributes)
    return Array.isArray(parsed?.Buttons) ? parsed.Buttons : []
  } catch {
    return []
  }
}

const ProjectCard = ({
  card,
  handleProjectDetailClick,
  handleNeedEventsClick,
}: ProjectCardProps) => {
  const [expanded, setExpanded] = useState(false)
  const buttons = useMemo(() => parseButtons(card.attributes), [card.attributes])

  const { adjCount, isLoading } = useEventCounts(card.id, 0, 'admin')
  const count = typeof adjCount === 'number' ? adjCount : 0

  return (
    <Card sx={{ maxWidth: 500, height: '100%' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#2bcbba' }}>
            {card.name?.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton
            aria-label="project settings"
            onClick={() => handleProjectDetailClick(card.id)}
          >
            <MdMoreVert />
          </IconButton>
        }
        title={card.name}
        subheader={card.title}
      />

      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          component="p"
          sx={
            expanded
              ? undefined
              : {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minHeight: 60,
                  maxWidth: 400,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }
          }
        >
          {card.description}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        {isLoading ? (
          <Chip
            size="small"
            label="Loading..."
            sx={{ fontWeight: 900, ml: 1 }}
          />
        ) : count > 0 ? (
          <Chip
            size="small"
            label={count}
            sx={{
              fontWeight: 900,
              ml: 1,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          />
        ) : (
          <Chip
            size="small"
            label="Need Events!"
            sx={{
              fontWeight: 900,
              ml: 1,
              bgcolor: 'secondary.light',
              color: 'secondary.contrastText',
            }}
            onClick={() => handleNeedEventsClick(card.id)}
          />
        )}

        <ExpandMore
          expand={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <MdExpandMore />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="text.secondary" component="p">
            <b>Goal:</b> {card.Goal}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="p">
            <b>Data:</b> {card.Data}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="p">
            <b>IRB:</b> {card.IRBNumber}
          </Typography>

          {buttons.map((button, index) => (
            <Button
              key={`${button.name}-${index}`}
              variant="contained"
              value={button.value}
              size="small"
              sx={{
                mt: 1,
                mr: 1,
                backgroundColor: button.color,
                color: '#ecf0f1',
              }}
            >
              {button.name}
            </Button>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default function Project() {
  const { projects } = useProjects()

  const [searchKey, setSearchKey] = useState('')
  const [open, setOpen] = useState(false)
  const [openFilesDialog, setOpenFilesDialog] = useState(false)
  const [value, setValue] = useState(0)
  const [projectId, setProjectId] = useState(0)

  const filteredProjects = useMemo(() => {
    const keyword = searchKey.trim().toLowerCase()

    if (!keyword) return projects

    return projects.filter((project) =>
      JSON.stringify(project).toLowerCase().includes(keyword)
    )
  }, [projects, searchKey])

  const handleProjectDetailClick = (id: number) => {
    setValue(1)
    setProjectId(id)
  }

  const handleNeedEventsClick = (id: number) => {
    setProjectId(id)
    setOpenFilesDialog(true)
  }

  return (
    <Box sx={{ mx: 'auto' }}>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        aria-labelledby="form-dialog-title"
      >
        <AddForm handleClose={() => setOpen(false)} />
      </Dialog>

      <Dialog
        open={openFilesDialog}
        onClose={() => setOpenFilesDialog(false)}
        maxWidth="xl"
        aria-labelledby="form-dialog-title"
      >
        <AssignEventDialog
          projectId={projectId}
          handleNeedEventsDialogClose={() => setOpenFilesDialog(false)}
        />
      </Dialog>

      <AppBar component="div" sx={{ px: 1 }} position="static" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1} width="100%">
            <Grid size="grow">
              <Typography color="inherit" variant="h6" component="h1">
                Projects
              </Typography>
            </Grid>
            <Grid>
              <Button variant="outlined" color="inherit" size="small">
                Report
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <AppBar component="div" sx={{ px: 1 }} position="static" elevation={0}>
        <Tabs value={value} onChange={(_event, newValue) => setValue(newValue)}>
          <Tab label="Overview" />
          <Tab label="Detail" disabled={projectId === 0} />
        </Tabs>
      </AppBar>

      <Container maxWidth="lg">
        {value === 0 ? (
          <Box>
            <Grid container spacing={2}>
              <Grid size={12}>
                <AppBar
                  position="static"
                  color="inherit"
                  elevation={0}
                  sx={{
                    backgroundColor: 'transparent',
                    mt: 6,
                    mb: 2,
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid size="grow">
                      <Search>
                        <SearchIconWrapper>
                          <BiSearchAlt />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Search anything"
                          value={searchKey}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchKey(event.target.value)
                          }
                          inputProps={{ 'aria-label': 'search' }}
                        />
                      </Search>
                    </Grid>

                    <Grid>
                      <Button
                        onClick={() => setOpen(true)}
                        variant="contained"
                        color="primary"
                        startIcon={<PlusIcon />}
                      >
                        New Project
                      </Button>
                    </Grid>
                  </Grid>
                </AppBar>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              {filteredProjects.map((card) => (
                <Grid key={card.id} size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                  <ProjectCard
                    card={card}
                    handleProjectDetailClick={handleProjectDetailClick}
                    handleNeedEventsClick={handleNeedEventsClick}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Detail
            project={projects.find((project) => project.id === projectId) ?? null}
          />
        )}
      </Container>
    </Box>
  )
}