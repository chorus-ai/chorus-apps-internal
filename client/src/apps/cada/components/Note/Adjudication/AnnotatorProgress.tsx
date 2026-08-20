import { useEffect } from 'react'

import { getAnnotatorProgress } from '../../../store/thunk';
import { Box, LinearProgress, Paper, Typography } from '@mui/material';
import { useAppSelector, useAppDispatch } from "../../../../../hooks/redux";

const FILTERED_UIDS = [1, 2, 6, 23]

export default function AnnotatorProgress({ pid, ___events }) {

  const progress = useAppSelector(
    (state) =>
      state.cada.annotatorProgress[pid]
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!progress && pid !== undefined && pid !== null) {
      dispatch(getAnnotatorProgress(pid, FILTERED_UIDS));
    }
  }, [progress]);

  const calculateProgress = (userProgress: any) => {
    const completed = userProgress.filter((p: any) => p.completed).length;

    return completed / userProgress.length;
  };

  return (
    <Paper sx={{ p: 2, display: "flex", alignItems: "center", flexDirection: "column" }}>
      {progress && Object.keys(progress).map((uid) => {
        const currProgress = calculateProgress(progress[uid]);
        return (
        <Box key={uid} sx={{ p: 2, width: "100%", display: "flex", alignItems: "center", flexDirection: "row" }}>
          <Typography variant="h6">{`${progress[uid][0].user.firstName} ${progress[uid][0].user.lastName}`}</Typography>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress variant="determinate" color={currProgress === 1 ? "success" : "primary"} value={currProgress * 100} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="h6" color="textSecondary">
              {currProgress * 100}%
            </Typography>
          </Box>
        </Box>
      )})}
    </Paper>
  )
}
