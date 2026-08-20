import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { useQuery } from '../../../hooks/useApiQuery';
import { useMutation } from '../../../hooks/useApiMutation';
import * as filesApi from '../api/files';
import type { FileJsonData } from '../types';

export function useFileJson(filePath: string | null) {
  const { data, isLoading, error, refetch } = useQuery<FileJsonData>(
    () => filesApi.getJson(filePath!),
    [filePath],
    { enabled: !!filePath },
  );

  return { data, isLoading, error, refetch };
}

export function useCreateFiles() {
  return useMutation(
    async (
      files: Array<{ path: string; type: string; info: string; ext: string }>,
    ) => {
      return filesApi.createBatch(files);
    },
  );
}
