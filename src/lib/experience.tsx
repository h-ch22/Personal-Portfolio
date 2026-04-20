import { ActivityIcon, BriefcaseIcon, FolderGitIcon, GitBranchIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ExperienceType } from '#/types/experience'

export const EXP_TYPE_ICONS: Record<ExperienceType, LucideIcon> = {
  Work: BriefcaseIcon,
  Project: FolderGitIcon,
  Activity: ActivityIcon,
  'Open Source': GitBranchIcon,
}
