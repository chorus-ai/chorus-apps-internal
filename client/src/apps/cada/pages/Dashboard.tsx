import { Grid, Container, Typography, Box, Chip } from "@mui/material";
;
import AssignmentCard from "../sections/Dashboard/AssignmentCard";
import { useAppSelector } from "../../../hooks/redux";
import { useUserProjects } from "../hooks";
import type { ProjectUserRole } from "../types";

function Assignments() {
  const user = useAppSelector((state) => state.main.user);
  const { userProjects, userRoles } = useUserProjects(user?.id ?? 0);

  const hasProjects = Object.keys(userProjects).length > 0;
  const roles = userRoles.length > 0 ? userRoles : null;

  const groupBy = function (xs: ProjectUserRole[], key: keyof ProjectUserRole) {
    return xs.reduce<Record<string, ProjectUserRole[]>>(function (rv, x) {
      const k = String(x[key]);
      (rv[k] = rv[k] || []).push(x);
      return rv;
    }, {});
  };

  if (user && hasProjects && roles) {
    return (
      <Container maxWidth="lg">
        {Object.keys(groupBy(roles, "role")).map((u) => (
          <div key={u}>
            <Typography
              component={"div"}
              sx={{
                paddingTop: 6,
                paddingBottom: 4,
              }}
              color="textSecondary"
            >
              {(u === "annotator" && "Annotations") ||
                (u === "adjudicator" && "Adjudications")}
              <Chip
                size="small"
                label={roles.filter((k) => k.role === u).length}
                sx={{
                  fontWeight: 900,
                  ml: 1,
                  bgcolor: "grey.400",
                  color: "primary.contrastText",
                }}
              />
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} justifyContent="flex-start">
                {roles
                  .filter((k) => k.role === u)
                  .map((cadaUser) => (
                    <Grid
                      padding={1}
                      key={cadaUser.id} size={{ xs: 12, sm: 8, md: 6, lg: 4 }}
                    >
                      <AssignmentCard
                        card={userProjects[cadaUser.cadaProjectId]}
                        user={cadaUser}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </div>
        ))}
      </Container>
    );
  } else {
    return (
      <Container
        sx={{
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          minHeight: "100vh",
          display: "flex",
        }}
      >
        <Typography variant="h3" paragraph>
          There are no assignments.
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          Contact your admin for assignments!
        </Typography>
      </Container>
    );
  }
}

export default Assignments;
