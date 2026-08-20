import { useState, useRef, useCallback, useEffect } from 'react';

interface ResizablePaperProps {
  children?: React.ReactNode;
  sx?: React.CSSProperties;
  initialHeight?: number;
  minHeight?: number;
  [key: string]: any;
}

export default function ResizablePaper({
  children,
  sx = {},
  initialHeight = 300,
  minHeight = 100,
  ...props
}: ResizablePaperProps) {
  const [height, setHeight] = useState(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [isAutoHeight, setIsAutoHeight] = useState(true); // Start in auto-height mode
  const startY = useRef(0);
  const startHeight = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const screenHeightThreshold = window.innerHeight * 0.2; // 20% of screen height

  const checkContentHeight = useCallback(() => {
    if (!contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;
    const contentWithPadding = contentHeight + 16; // Add padding

    // Switch to auto-height if content is small enough
    const shouldAutoHeight = contentWithPadding <= screenHeightThreshold;

    if (shouldAutoHeight !== isAutoHeight) {
      setIsAutoHeight(shouldAutoHeight);
      if (shouldAutoHeight) {
        // Switching to auto height - no fixed height needed
        setHeight(contentWithPadding);
      } else {
        // Switching to fixed height - use a reasonable default or current content height
        const newHeight = Math.max(minHeight, Math.min(contentWithPadding, initialHeight));
        setHeight(newHeight);
      }
    } else if (isAutoHeight) {
      // Update height in auto mode to match content
      setHeight(contentWithPadding);
    }
  }, [screenHeightThreshold, isAutoHeight, initialHeight, minHeight]);

  // Set up ResizeObserver to watch content changes
  useEffect(() => {
    if (!contentRef.current) return;

    resizeObserverRef.current = new ResizeObserver(() => {
      // Use setTimeout to avoid ResizeObserver loop errors
      setTimeout(() => {
        checkContentHeight();
      }, 0);
    });

    resizeObserverRef.current.observe(contentRef.current);

    // Initial check
    setTimeout(() => {
      checkContentHeight();
    }, 0);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [checkContentHeight]);

  // Update threshold when window resizes
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        checkContentHeight();
      }, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkContentHeight]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isAutoHeight) return; // Don't allow resizing in auto-height mode

    e.preventDefault();
    setIsResizing(true);
    startY.current = e.clientY;
    startHeight.current = height;

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ns-resize';
  }, [height, isAutoHeight]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || isAutoHeight) return;

    const deltaY = e.clientY - startY.current;
    const newHeight = Math.max(minHeight, startHeight.current + deltaY);
    setHeight(newHeight);
  }, [isResizing, minHeight, isAutoHeight]);

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';

      // After manual resize, force into fixed height mode
      setIsAutoHeight(false);
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      {...props}
      style={{
        height: isAutoHeight ? 'auto' : `${height}px`,
        position: 'relative',
        backgroundColor: '#fff',
        // border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '4px',
        boxShadow: '0px 1px 1px -1px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0), 0px 1px 1px 0px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {/* Content Area */}
      <div
        ref={contentRef}
        style={{
          flex: isAutoHeight ? 'none' : 1,
          overflowY: isAutoHeight ? 'visible' : 'auto',
          padding: '8px 16px',
          minHeight: isAutoHeight ? 'auto' : 0,
        }}
      >
        {children}
      </div>

      {/* Resize Handle - Only show when not in auto-height mode */}
      {!isAutoHeight && (
        <div
          onMouseDown={handleMouseDown}
          style={{
            height: '6px',
            backgroundColor: isResizing ? '#1976d2' : 'transparent',
            cursor: 'ns-resize',
            borderBottom: '2px solid transparent',
            transition: isResizing ? 'none' : 'background-color 0.2s ease',
            zIndex: 10,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!isResizing) {
              (e.target as HTMLDivElement).style.backgroundColor = '#e3f2fd';
            }
          }}
          onMouseLeave={(e) => {
            if (!isResizing) {
              (e.target as HTMLDivElement).style.backgroundColor = 'transparent';
            }
          }}
        />
      )}
    </div>
  );
};
