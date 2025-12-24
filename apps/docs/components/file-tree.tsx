"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { FileIcon, FolderIcon, ChevronRight } from "lucide-react"

interface FileTreeProps {
  className?: string
  children: React.ReactNode
}

interface FolderProps {
  name: string
  children?: React.ReactNode
  defaultOpen?: boolean
  comment?: string
}

interface FileProps {
  name: string
  comment?: string
}

interface MoreFilesProps {
  files: string[]
  totalRemaining: number
  batchSize?: number
}

export function FileTree({ className, children }: FileTreeProps) {
  return (
    <div
      className={cn(
        "my-6 rounded-lg border bg-muted/30 p-4 font-mono text-sm overflow-x-auto",
        className
      )}
    >
      <div className="flex flex-col gap-1 min-w-max">{children}</div>
    </div>
  )
}

export function Folder({ name, children, comment }: FolderProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 py-0.5">
        <FolderIcon className="h-4 w-4 flex-shrink-0 text-[#e8683a]" />
        <span className="text-foreground whitespace-nowrap">{name}</span>
        {comment && (
          <span className="text-muted-foreground text-xs ml-2 whitespace-nowrap"># {comment}</span>
        )}
      </div>
      {children && (
        <div className="ml-4 flex flex-col gap-0.5 border-l border-muted-foreground/20 pl-3">
          {children}
        </div>
      )}
    </div>
  )
}

export function File({ name, comment }: FileProps) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <FileIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <span className="text-foreground whitespace-nowrap">{name}</span>
      {comment && (
        <span className="text-muted-foreground text-xs ml-2 whitespace-nowrap"># {comment}</span>
      )}
    </div>
  )
}

export function MoreFiles({ files, totalRemaining, batchSize = 10 }: MoreFilesProps) {
  const [revealedCount, setRevealedCount] = useState(0)

  const revealedFiles = files.slice(0, revealedCount)
  const remainingToReveal = files.length - revealedCount
  const actualRemaining = totalRemaining - revealedCount

  const handleExpand = () => {
    setRevealedCount(prev => Math.min(prev + batchSize, files.length))
  }

  return (
    <>
      {revealedFiles.map((file, index) => (
        <File key={index} name={file} />
      ))}
      {(remainingToReveal > 0 || actualRemaining > files.length) && (
        <button
          onClick={handleExpand}
          className="flex items-center gap-2 py-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
        >
          <ChevronRight className="h-4 w-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          <span className="whitespace-nowrap">...</span>
          <span className="text-xs ml-2 whitespace-nowrap"># {actualRemaining}+ more</span>
        </button>
      )}
    </>
  )
}
