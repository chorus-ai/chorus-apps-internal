import { Box, Container, Paper, Typography, LinearProgress } from '@mui/material';
import { useAnnotatorProgress } from '../../../hooks';
import type { AnnotatorProgressItem } from '../../../types';

export default function AnnotatorProgress({ pid }: { pid: string }) {

  const { progress, isLoading } = useAnnotatorProgress(Number(pid));

  const calculateProgress = (userProgress: AnnotatorProgressItem[]) => {
    const completed = userProgress.filter((p) => p.completed).length;
    return completed / userProgress.length;
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Annotator Progress</Typography>
        {progress && Object.keys(progress).map((uid) => {
          const currProgress = calculateProgress(progress[uid]);
          const userInfo = progress[uid][0]?.user;
          const completed = progress[uid].filter((p) => p.completed).length;
          const total = progress[uid].length;

          return (
            <Box key={uid} sx={{ p: 1, width: "100%", display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1" sx={{ minWidth: 150 }}>
                {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : `User ${uid}`}
              </Typography>
              <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  color={currProgress === 1 ? "success" : "primary"}
                  value={currProgress * 100}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80, textAlign: 'right' }}>
                {completed}/{total} ({Math.round(currProgress * 100)}%)
              </Typography>
            </Box>
          );
        })}
        {(!progress || Object.keys(progress).length === 0) && (
          <Typography variant="body2" color="text.secondary">
            No annotator progress data available.
          </Typography>
        )}
      </Paper>
    </Container>
  )
}
