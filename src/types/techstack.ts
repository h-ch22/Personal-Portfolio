export type TechStackCategory = 'Language' | 'Framework' | 'Tool' | 'Platform' | 'Database' | 'Other'

export type TechStackIconType = 'emoji' | 'image'

export type TechStackProficiency = 'Proficient' | 'Experienced' | 'Basic'

export const TECH_PROFICIENCY_LEVELS: TechStackProficiency[] = ['Proficient', 'Experienced', 'Basic']

export const TECH_PROFICIENCY_COLORS: Record<TechStackProficiency, string> = {
  Proficient: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  Experienced: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  Basic: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

export type TechStackGroup =
  | 'Frontend'
  | 'Backend'
  | 'Mobile'
  | 'Desktop'
  | 'DevOps'
  | 'Cloud'
  | 'Database'
  | 'AI/ML'
  | 'Geometric'
  | 'IoT & Embedded'
  | 'Edge Computing'
  | 'Hardware & System'
  | 'CS Foundation'
  | 'Game'
  | 'XR'
  | 'Engine'
  | 'VCS'
  | 'Management'
  | 'Other'

export const TECH_STACK_GROUPS: TechStackGroup[] = [
  'Frontend',
  'Backend',
  'Mobile',
  'Desktop',
  'DevOps',
  'Cloud',
  'Database',
  'AI/ML',
  'Geometric',
  'IoT & Embedded',
  'Edge Computing',
  'Hardware & System',
  'CS Foundation',
  'Game',
  'XR',
  'Engine',
  'VCS',
  'Management',
  'Other',
]

export const TECH_STACK_GROUP_COLORS: Record<TechStackGroup, string> = {
  Frontend: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  Backend: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  Mobile: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
  Desktop: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
  DevOps: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  Cloud: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
  Database: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  'AI/ML': 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200',
  Geometric: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
  'IoT & Embedded': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200',
  'Edge Computing': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200',
  'Hardware & System': 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  'CS Foundation': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
  Game: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
  'XR': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-200',
  'Engine': 'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-200',
  VCS: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
  Management: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Other: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
}

export type TechStack = {
    id: string
    name: string
    iconType: TechStackIconType
    icon: string
    iconPath?: string
    category: TechStackCategory
    proficiency?: TechStackProficiency
    group?: TechStackGroup
}

export const TECH_CATEGORIES: TechStackCategory[] = [
  'Language',
  'Framework',
  'Tool',
  'Platform',
  'Database',
  'Other',
]

export type TechStackRequest = Omit<TechStack, 'id'>
