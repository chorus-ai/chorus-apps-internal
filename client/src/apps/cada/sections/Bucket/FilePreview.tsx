import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { MdClose } from 'react-icons/md';
import axios from 'axios';

const TEXT_EXTENSIONS = new Set([
  'txt', 'text', 'csv', 'tsv', 'md', 'log', 'xml', 'yaml', 'yml',
  'ini', 'cfg', 'conf', 'env', 'sh', 'bash', 'py', 'js', 'ts',
  'jsx', 'tsx', 'html', 'htm', 'css', 'scss', 'less', 'sql',
  'r', 'sas', 'do', 'stata', 'readme', 'gitignore', 'dockerignore',
]);

const IMAGE_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico',
]);

type PreviewType = 'json' | 'text' | 'pdf' | 'image' | 'unsupported';

function getPreviewType(filename: string): PreviewType {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (ext === 'json') return 'json';
  if (ext === 'pdf') return 'pdf';
  if (IMAGE_EXTENSIONS.has(ext)) return 'image';
  if (TEXT_EXTENSIONS.has(ext)) return 'text';
  return 'unsupported';
}

function TextContent({ content, isJson }: { content: string; isJson: boolean }) {
  let display = content;
  if (isJson) {
    try {
      display = JSON.stringify(JSON.parse(content), null, 2);
    } catch {
      // not valid JSON, show raw
    }
  }

  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        p: 2,
        bgcolor: '#f8f9fa',
        borderRadius: 1,
        overflow: 'auto',
        maxHeight: 'calc(80vh - 100px)',
        fontSize: '0.85rem',
        fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        tabSize: 2,
      }}
    >
      {display}
    </Box>
  );
}

export default function FilePreview({
  open,
  onClose,
  filePath,
}: {
  open: boolean;
  onClose: () => void;
  filePath: string;
}) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filename = filePath.split('/').pop() || filePath;
  const previewType = getPreviewType(filename);

  useEffect(() => {
    if (!open || !filePath) return;

    setContent(null);
    setError(null);

    if (previewType === 'json' || previewType === 'text') {
      setLoading(true);
      axios
        .get(`/api/cada/file/text?filename=${encodeURIComponent(filePath)}`, {
          responseType: 'text',
          transformResponse: [(data) => data], // prevent axios JSON parsing
        })
        .then((res) => setContent(res.data))
        .catch(() => setError('Failed to load file'))
        .finally(() => setLoading(false));
    }
  }, [open, filePath, previewType]);

  const encodedPath = encodeURIComponent(filePath);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { maxHeight: '85vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
        <Typography variant="subtitle1" sx={{ fontFamily: 'monospace', fontWeight: 600 }} noWrap>
          {filename}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <MdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {previewType === 'unsupported' && (
          <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Preview not available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Files with .{filename.split('.').pop()} extension cannot be previewed.
            </Typography>
          </Box>
        )}

        {(previewType === 'json' || previewType === 'text') && content !== null && (
          <TextContent content={content} isJson={previewType === 'json'} />
        )}

        {previewType === 'pdf' && (
          <Box sx={{ height: 'calc(80vh - 100px)' }}>
            <iframe
              src={`/api/cada/file/pdf?filename=${encodedPath}`}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title={filename}
            />
          </Box>
        )}

        {previewType === 'image' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, maxHeight: 'calc(80vh - 100px)', overflow: 'auto' }}>
            <img
              src={`/api/cada/file/raw?filename=${encodedPath}`}
              alt={filename}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
