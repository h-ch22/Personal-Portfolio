import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckIcon, MinusIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react'

import { fetchTechStacks } from '#/api/techstack/techstack'
import { fetchExperience } from '#/api/experience/experience'
import { fetchProjects } from '#/api/projects/projects'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  TECH_STACK_GROUP_COLORS,
  TECH_STACK_GROUPS,
  type TechStackGroup,
} from '#/types/techstack'
import type { TechStackItem } from '#/types/experience'
import { groupAndOrderTechStack } from '#/lib/techstack'

const EMPTY_INPUT = { name: '', iconUrl: '', group: 'Other' as TechStackGroup }

interface TechStackInputProps {
  value: TechStackItem[]
  onChange: (items: TechStackItem[]) => void
}

export function TechStackInput({ value, onChange }: TechStackInputProps) {
  const [addForm, setAddForm] = useState(EMPTY_INPUT)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState(EMPTY_INPUT)
  const [importOpen, setImportOpen] = useState(false)
  const [importSearch, setImportSearch] = useState('')

  const { data: homeTechStacks = [] } = useQuery({
    queryKey: ['techstacks'],
    queryFn: fetchTechStacks,
    staleTime: 1000 * 60 * 5,
  })

  const { data: experiences = [] } = useQuery({
    queryKey: ['experience'],
    queryFn: fetchExperience,
    staleTime: 1000 * 60 * 5,
  })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5,
  })

  const previouslyUsed: TechStackItem[] = (() => {
    const seen = new Set<string>()
    const result: TechStackItem[] = []
    ;[...experiences, ...projects].forEach((item) => {
      item.techStack.forEach((t) => {
        const key = t.name.toLowerCase()
        if (!seen.has(key)) {
          seen.add(key)
          result.push(t)
        }
      })
    })
    return result.sort((a, b) => a.name.localeCompare(b.name))
  })()

  const addedKeys = new Set(
    value.map((t) => `${t.name.toLowerCase()}|${t.group ?? ''}`),
  )

  const filteredHome = homeTechStacks
    .filter(
      (t) =>
        !importSearch.trim() ||
        t.name.toLowerCase().includes(importSearch.toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  const filteredPrev = previouslyUsed.filter(
    (t) =>
      !importSearch.trim() ||
      t.name.toLowerCase().includes(importSearch.toLowerCase()),
  )

  const handleAdd = () => {
    if (!addForm.name.trim()) return
    onChange([
      ...value,
      {
        name: addForm.name.trim(),
        group: addForm.group,
        ...(addForm.iconUrl.trim() && { iconUrl: addForm.iconUrl.trim() }),
      },
    ])
    setAddForm(EMPTY_INPUT)
  }

  const handleEditStart = (index: number) => {
    const item = value[index]
    setEditingIndex(index)
    setEditForm({
      name: item.name,
      iconUrl: item.iconUrl ?? '',
      group: (item.group as TechStackGroup) ?? 'Other',
    })
  }

  const handleEditSave = () => {
    if (editingIndex === null || !editForm.name.trim()) return
    const updated = value.map((item, i) =>
      i === editingIndex
        ? {
            name: editForm.name.trim(),
            group: editForm.group,
            ...(editForm.iconUrl.trim() && {
              iconUrl: editForm.iconUrl.trim(),
            }),
          }
        : item,
    )
    onChange(updated)
    setEditingIndex(null)
    setEditForm(EMPTY_INPUT)
  }

  const handleEditCancel = () => {
    setEditingIndex(null)
    setEditForm(EMPTY_INPUT)
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
    if (editingIndex === index) {
      setEditingIndex(null)
      setEditForm(EMPTY_INPUT)
    }
  }

  const handleImportItem = (item: TechStackItem) => {
    const key = `${item.name.toLowerCase()}|${item.group ?? ''}`
    if (addedKeys.has(key)) {
      onChange(
        value.filter((t) => `${t.name.toLowerCase()}|${t.group ?? ''}` !== key),
      )
    } else {
      onChange([
        ...value,
        {
          name: item.name,
          group: item.group,
          ...(item.iconUrl && { iconUrl: item.iconUrl }),
        },
      ])
    }
  }

  const ImportItem = ({ item }: { item: TechStackItem }) => {
    const key = `${item.name.toLowerCase()}|${item.group ?? ''}`
    const isAdded = addedKeys.has(key)
    return (
      <button
        type="button"
        onClick={() => handleImportItem(item)}
        className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors text-left ${
          isAdded ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
        }`}
      >
        {item.iconUrl && (
          <img
            src={item.iconUrl}
            alt={item.name}
            className="w-4 h-4 object-contain shrink-0"
          />
        )}
        <span className="flex-1 truncate">{item.name}</span>
        {item.group && (
          <span className="text-xs text-muted-foreground shrink-0">
            {item.group}
          </span>
        )}
        {isAdded && <CheckIcon className="w-3.5 h-3.5 shrink-0" />}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          placeholder="Name (e.g. Swift)"
          value={addForm.name}
          onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
        />
        <Input
          placeholder="Icon URL (optional)"
          value={addForm.iconUrl}
          onChange={(e) =>
            setAddForm((p) => ({ ...p, iconUrl: e.target.value }))
          }
        />
        <Select
          value={addForm.group}
          onValueChange={(v) =>
            setAddForm((p) => ({ ...p, group: v as TechStackGroup }))
          }
        >
          <SelectTrigger className="w-36 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {TECH_STACK_GROUPS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="icon" onClick={handleAdd}>
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={importOpen ? 'secondary' : 'outline'}
          size="icon"
          title="Import tech stacks"
          onClick={() => {
            setImportOpen((v) => !v)
            setImportSearch('')
          }}
        >
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>

      {importOpen && (
        <div className="rounded-md border bg-popover p-3 flex flex-col gap-2">
          <Input
            placeholder="Search..."
            value={importSearch}
            onChange={(e) => setImportSearch(e.target.value)}
            autoFocus
          />
          <Tabs defaultValue="home">
            <TabsList className="w-full">
              <TabsTrigger value="home" className="flex-1">
                Tech Stack
              </TabsTrigger>
              <TabsTrigger value="prev" className="flex-1">
                Previously Used
              </TabsTrigger>
            </TabsList>
            <TabsContent value="home" className="mt-2">
              <div className="max-h-56 overflow-y-auto">
                {filteredHome.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No results
                  </p>
                ) : (
                  filteredHome.map((t) => (
                    <ImportItem
                      key={t.id}
                      item={{
                        name: t.name,
                        iconUrl: t.iconType === 'image' ? t.icon : undefined,
                        group: t.groups?.[0],
                      }}
                    />
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="prev" className="mt-2">
              <div className="max-h-56 overflow-y-auto">
                {filteredPrev.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No results
                  </p>
                ) : (
                  filteredPrev.map((t, i) => <ImportItem key={i} item={t} />)
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {value.length > 0 &&
        (() => {
          const indexed = value.map((tech, index) => ({ tech, index }))
          const { grouped, orderedGroups } = groupAndOrderTechStack(
            indexed,
            (item) => item.tech.group ?? 'Other',
          )
          return (
            <div className="flex flex-col gap-2">
              {orderedGroups.map((g) => (
                <div key={g} className="flex flex-wrap items-start gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground w-16 shrink-0 pt-1">
                    {g}
                  </span>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {grouped[g].map(({ tech, index }) => (
                      <div key={index}>
                        {editingIndex === index ? (
                          <div className="flex flex-wrap gap-1.5 items-center p-2 rounded-lg border bg-muted/50">
                            <Input
                              className="h-7 text-xs w-32"
                              placeholder="Name"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm((p) => ({
                                  ...p,
                                  name: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  handleEditSave()
                                }
                              }}
                              autoFocus
                            />
                            <Input
                              className="h-7 text-xs w-40"
                              placeholder="Icon URL"
                              value={editForm.iconUrl}
                              onChange={(e) =>
                                setEditForm((p) => ({
                                  ...p,
                                  iconUrl: e.target.value,
                                }))
                              }
                            />
                            <Select
                              value={editForm.group}
                              onValueChange={(v) =>
                                setEditForm((p) => ({
                                  ...p,
                                  group: v as TechStackGroup,
                                }))
                              }
                            >
                              <SelectTrigger className="h-7 text-xs w-28 shrink-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {TECH_STACK_GROUPS.map((g) => (
                                    <SelectItem key={g} value={g}>
                                      {g}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                size="icon"
                                className="h-7 w-7"
                                onClick={handleEditSave}
                              >
                                <CheckIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={handleEditCancel}
                              >
                                <XIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="h-7 w-7"
                                onClick={() => handleRemove(index)}
                              >
                                <MinusIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Badge
                            variant="outline"
                            className={`flex items-center gap-1.5 pl-1.5 pr-1 py-1 h-auto cursor-pointer border-0 ${TECH_STACK_GROUP_COLORS[g as TechStackGroup] ?? TECH_STACK_GROUP_COLORS.Other}`}
                            onClick={() => handleEditStart(index)}
                          >
                            {tech.iconUrl && (
                              <img
                                src={tech.iconUrl}
                                alt={tech.name}
                                className="w-4 h-4 rounded-sm object-contain"
                              />
                            )}
                            <span className="text-xs">{tech.name}</span>
                            <button
                              type="button"
                              className="ml-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 p-0.5"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemove(index)
                              }}
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        })()}

      <p className="text-xs text-muted-foreground">
        Click a badge to edit · <SearchIcon className="inline w-3 h-3" /> to
        import from Tech Stack or previous entries
      </p>
    </div>
  )
}
