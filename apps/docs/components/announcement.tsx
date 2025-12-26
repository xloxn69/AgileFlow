import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { siteConfig } from "@/lib/config"
import { Badge } from "@/registry/new-york-v4/ui/badge"

export function Announcement() {
  return (
    <Badge asChild variant="secondary" className="bg-transparent">
      <Link href={`${siteConfig.links.github}/releases`} target="_blank" rel="noreferrer">
        <span className="flex size-2 rounded-full bg-blue-500" title="New" />
        View Releases <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
