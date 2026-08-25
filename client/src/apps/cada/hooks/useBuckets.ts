import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../../hooks/redux'
import { useQuery } from '../../../hooks/useApiQuery'
import * as bucketsApi from '../api/buckets'
import { setBuckets, showAlert } from '../store'

export function useBucket(path: string) {
  const buckets = useAppSelector((state) => state.cada.buckets)
  const dispatch = useAppDispatch()

  const bucket = buckets[path]

  const { isLoading, error, refetch } = useQuery(
    async () => {
      const data = await bucketsApi.get(path)

      dispatch(
        setBuckets({
          path,
          data,
        })
      )

      return data
    },
    [path],
    { enabled: bucket === undefined }
  )

  useEffect(() => {
    if (error) {
      dispatch(
        showAlert({
          message: error.message,
          severity: 'warning',
        })
      )
    }
  }, [error, dispatch])

  return { bucket, isLoading, refetch }
}