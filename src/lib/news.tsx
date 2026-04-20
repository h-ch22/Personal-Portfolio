import {
  ActivityIcon,
  BookOpenIcon,
  FlaskConicalIcon,
  NewspaperIcon,
  TagIcon,
  TrophyIcon,
} from 'lucide-react'
import type { NewsCategory } from '#/types/news'

export const CATEGORY_ICON: Record<NewsCategory, React.ReactNode> = {
  Award:       <TrophyIcon className="w-3 h-3" />,
  Research:    <FlaskConicalIcon className="w-3 h-3" />,
  Publication: <BookOpenIcon className="w-3 h-3" />,
  Activity:    <ActivityIcon className="w-3 h-3" />,
  Press:       <NewspaperIcon className="w-3 h-3" />,
  Other:       <TagIcon className="w-3 h-3" />,
}
