import { TECH_STACK_GROUPS, type TechStackGroup } from '#/types/techstack'

export function groupAndOrderTechStack<T>(
  items: T[],
  getGroup: (item: T) => string = (item) => (item as any).group ?? 'Other',
): { grouped: Record<string, T[]>; orderedGroups: string[] } {
  const grouped = items.reduce<Record<string, T[]>>((acc, item) => {
    const g = getGroup(item)
    if (!acc[g]) acc[g] = []
    acc[g].push(item)
    return acc
  }, {})
  const orderedGroups = [
    ...TECH_STACK_GROUPS.filter((g) => grouped[g]),
    ...Object.keys(grouped).filter((g) => !TECH_STACK_GROUPS.includes(g as TechStackGroup)),
  ]
  return { grouped, orderedGroups }
}
