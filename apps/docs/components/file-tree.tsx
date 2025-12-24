import { cn } from "@/lib/utils"
import { FileIcon, FolderIcon } from "lucide-react"

interface FileTreeProps {
  className?: string
  children: React.ReactNode
}

interface FolderProps {
  name: string
  children?: React.ReactNode
  defaultOpen?: boolean
}

interface FileProps {
  name: string
  comment?: string
}

export function FileTree({ className, children }: FileTreeProps) {
  return (
    <div
      className={cn(
        "my-6 rounded-lg border bg-muted/30 p-4 font-mono text-sm",
        className
      )}
    >
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}

export function Folder({ name, children }: FolderProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 py-0.5">
        <FolderIcon className="h-4 w-4 text-blue-500" />
        <span className="text-foreground">{name}</span>
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
      <FileIcon className="h-4 w-4 text-muted-foreground" />
      <span className="text-foreground">{name}</span>
      {comment && (
        <span className="text-muted-foreground text-xs ml-2"># {comment}</span>
      )}
    </div>
  )
}
