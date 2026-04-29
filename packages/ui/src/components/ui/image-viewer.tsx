import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './dialog'
import { Button } from './button'
import { cn } from '../../lib/utils'

interface ImageViewerProps {
  src: string
  alt?: string
  className?: string
  thumbnailClassName?: string
}

function ImageViewer({ src, alt = 'Image', className, thumbnailClassName }: ImageViewerProps) {
  const [open, setOpen] = React.useState(false)
  const [scale, setScale] = React.useState(1)

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.25))
  const handleReset = () => setScale(1)

  const handleOpenChange = (state: boolean) => {
    setOpen(state)
    if (!state) setScale(1)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'cursor-pointer overflow-hidden rounded-lg border transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
      >
        <img
          src={src}
          alt={alt}
          className={cn('h-48 w-full object-cover', thumbnailClassName)}
        />
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-[95vw]! w-[95vw] h-[95vh] max-h-[95vh] p-0 overflow-hidden flex flex-col">
          <DialogTitle className="sr-only">{alt}</DialogTitle>

          {/* Zoom controls */}
          <div className="flex items-center justify-center gap-2 border-b px-4 py-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={scale <= 0.25}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              {Math.round(scale * 100)}%
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={scale >= 3}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </Button>
          </div>

          {/* Image container with scroll */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { ImageViewer }
export type { ImageViewerProps }
