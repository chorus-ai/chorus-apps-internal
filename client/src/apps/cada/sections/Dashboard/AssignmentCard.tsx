import React from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  Chip,
  Stack,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import {
  MdExpandMore as ExpandMoreIcon,
  MdMoreVert as MoreVertIcon,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEventCounts } from "../../hooks";
import type { ProjectWithRoles, ProjectUserRole } from "../../types";

// ----------------------------------------------------------------------

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

// ----------------------------------------------------------------------

interface AssignmentCardProps {
  card: ProjectWithRoles;
  user: ProjectUserRole;
}

export default function AssignmentCard({ card, user }: AssignmentCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const { annCount, adjCount } = useEventCounts(card.id, user.userId, user.role);

  const navigate = useNavigate();
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#0fb9b1" }}>
            {card.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton
            aria-label="settings"
            onClick={() =>
              navigate(
                "/cada/" + user.role + "/" + card.projectType + "/" + card.id
              )
            }
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={card.name}
        subheader={card.title}
      />
      <CardContent>
        <Typography
          sx={
            expanded
              ? {}
              : {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minHeight: 60,
                  maxWidth: 400,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }
          }
          variant="body2"
          color="text.secondary"
          component="p"
        >
          {card.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {user.role === "annotator" ? (
          <Stack direction="row">
            <Chip
              size="small"
              label={annCount && annCount[0] ? annCount[0] : 0}
              sx={{
                fontWeight: 900,
                ml: 1,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            />
            <Chip
              size="small"
              label={annCount && annCount[1] ? annCount[1] : 0}
              color="secondary"
              sx={{
                fontWeight: 900,
                ml: 1,
                bgcolor: "primary.secondary",
                color: "primary.contrastText",
              }}
            />
          </Stack>
        ) : (
          <Chip
            size="small"
            label={adjCount ? adjCount : 0}
            sx={{
              fontWeight: 900,
              ml: 1,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          />
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="text.secondary" component="p">
            <b>Goal: </b> {card.goal}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="p">
            <b>Data: </b>
            {card.data}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
