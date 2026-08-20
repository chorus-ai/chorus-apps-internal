import { useState } from 'react'
import {
  Box,
  Container,
  Breadcrumbs,
  IconButton,
  LinearProgress,
  Typography,
  Link,
} from '@mui/material'
import { MdNavigateNext, MdHome, MdFolderOpen } from 'react-icons/md'
import { createTheme } from '@mui/material/styles'

import BucketTable from '../sections/Bucket/BucketTable'
import { useBucket } from '../hooks'
import type { BucketFile } from '../types'

const theme = createTheme()

const sortPaths = (paths: BucketFile[]) => {
  const extractKey = (str: string) =>
    (str.match(/\d+|[^\d]+/g) || []).map((chunk) =>
      Number.isNaN(Number(chunk)) ? chunk : Number(chunk)
    )

  const naturalCompare = (a: string, b: string) => {
    const aParts = extractKey(a)
    const bParts = extractKey(b)

    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      if (aParts[i] !== bParts[i]) {
        return typeof aParts[i] === 'number' && typeof bParts[i] === 'number'
          ? (aParts[i] as number) - (bParts[i] as number)
          : String(aParts[i]).localeCompare(String(bParts[i]))
      }
    }

    return aParts.length - bParts.length
  }

  return [...paths].sort((a, b) => {
    if (a.type === b.type) {
      return naturalCompare(a.path, b.path)
    }

    return a.type === 'dir' ? -1 : 1
  })
}

export default function Bucket() {
  const [path, setPath] = useState('')

  const { bucket, isLoading } = useBucket(path)

  const handleClick = (name: string) => {
    setPath((prev) => (prev === '' ? name : `${prev}/${name}`))
  }

  const handlePathClick = (idx: number) => {
    const parts = path.split('/')
    const newPath = parts.slice(0, idx + 1).join('/')
    setPath(newPath)
  }

  const files = bucket?.files ?? []
  const hasFiles = files.length > 0
  const sortedPaths = sortPaths(files)

  return (
    <Container maxWidth="lg" sx={{ mt: theme.spacing(5) }}>
      <Breadcrumbs
        sx={{ py: 2 }}
        separator={<MdNavigateNext />}
        aria-label="breadcrumb"
      >
        <IconButton onClick={() => setPath('')} aria-label="Go to root">
          <MdHome />
        </IconButton>

        {path !== ''
          ? path.split('/').map((part, idx, arr) => {
              const isLast = idx === arr.length - 1

              return (
                <Link
                  key={`${part}-${idx}`}
                  component="button"
                  type="button"
                  underline="hover"
                  color={isLast ? 'text.primary' : 'inherit'}
                  onClick={() => !isLast && handlePathClick(idx)}
                  sx={{
                    cursor: isLast ? 'default' : 'pointer',
                    pointerEvents: isLast ? 'none' : 'auto',
                  }}
                >
                  {part}
                </Link>
              )
            })
          : null}
      </Breadcrumbs>

      {isLoading ? (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      ) : hasFiles ? (
        <BucketTable
          path={path}
          handleClickDir={handleClick}
          paths={sortedPaths}
        />
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <MdFolderOpen size={48} color="#b2bec3" />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            This directory is empty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {path
              ? `No files or folders found in /${path}`
              : 'No files or folders found in the root directory'}
          </Typography>
        </Box>
      )}
    </Container>
  )
}