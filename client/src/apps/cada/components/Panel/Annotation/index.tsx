import { useState } from "react";
import {
  AppBar,
  Typography,
  Button,
  Toolbar,
  Box,
  LinearProgress,
  createTheme,
} from "@mui/material";

import { NoContent } from "../../../common/NoContent";
import { Download } from "../../../common/Download";
import { InputPagination } from "../../../common/InputPagination";
import Panel from "./Panel";
import { useAppSelector } from "../../../../../hooks/redux";
import { useAnnotationEvents } from "../../../hooks";
import type { FormSummary, AnnotationValue } from "../../../types";

const theme = createTheme();

const useStyles = {
  pages: {
    position: "relative",
    zIndex: 0,
    padding: theme.spacing(2),
    left: 0,
    right: 0,
  },
};

interface AnnotationProps {
  pid: string;
  type: string;
}

export default function Annotation({ pid, type }: AnnotationProps) {
  const projectId = Number(pid);

  const user = useAppSelector((state) => state.main.user);
  const project = useAppSelector((state) => state.cada.userProjects[pid]);

  const { events, isLoading } = useAnnotationEvents(projectId, user?.id ?? 0);

  const [eIdx, setEIdx] = useState(0);

  let form: FormSummary | null = null;

  if (project?.forms?.length) {
    form = [...project.forms].sort(
      (a: FormSummary, b: FormSummary) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )[0];
  }

  const allEvents = [
    ...(events?.true || []),
    ...(events?.false || []),
  ];

  const orderedEvents = [...allEvents].sort((a, b) =>
    a.id < b.id ? -1 : a.id > b.id ? 1 : 0
  );

  const totalEvents = orderedEvents.length;

  const downloadData: any[] = [];

  if (user?.email) {
    orderedEvents
      .filter(
        (event) =>
          (event.cadaAnnotations?.[0]?.cadaAnnotationValues?.length ?? 0) > 0
      )
      .forEach((event) => {
        const groupedByField: Record<string, AnnotationValue> = {};

        (event.cadaAnnotations?.[0]?.cadaAnnotationValues || []).forEach(
          (obj: AnnotationValue) => {
            const field = obj.field;
            if (!groupedByField[field] || obj.id > groupedByField[field].id) {
              groupedByField[field] = obj;
            }
          }
        );

        Object.values(groupedByField).forEach((item) => {
          downloadData.push({
            user: user.email,
            file: event.cadaFile.path,
            field: item.field,
            createAt: item.createdAt,
            value: item.value,
          });
        });
      });
  }

  const handlePageChange = (_e: React.ChangeEvent<unknown>, page: number) => {
    setEIdx(page - 1);
  };

  const handleInputPage = (page: number) => {
    if (totalEvents <= 0) {
      setEIdx(0);
      return;
    }

    if (page <= 1) {
      setEIdx(0);
      return;
    }

    if (page > totalEvents) {
      setEIdx(totalEvents - 1);
      return;
    }

    setEIdx(page - 1);
  };

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!project || !events || totalEvents === 0) {
    return (
      <NoContent
        text="There are no assignments!"
        subtext="Contact your admin for assignments!"
      />
    );
  }

  return (
    <div style={{ height: "calc(100vh - 250px)" }}>
      <AppBar component="div" sx={{ pl: 1 }} position="static" elevation={0}>
        <Toolbar>
          <Typography color="inherit" variant="h6" component="h1">
            {project.name} Annotation
          </Typography>

          <div style={{ flex: "1 1 auto" }} />

          <Download data={downloadData} />

          <Button variant="outlined" color="inherit" size="small">
            Report
          </Button>
        </Toolbar>
      </AppBar>

      <AppBar
        component="div"
        sx={{ px: 1, height: 10 }}
        position="static"
        elevation={0}
      />

      <Panel
        events={orderedEvents}
        eIdx={eIdx}
        setEIdx={setEIdx}
        user={user}
        project={project}
        form={form}
        type={type}
      />

      <Box sx={useStyles.pages}>
        <InputPagination
          total={totalEvents}
          page={eIdx + 1}
          onChange={handlePageChange}
          onInput={handleInputPage}
        />
      </Box>
    </div>
  );
}