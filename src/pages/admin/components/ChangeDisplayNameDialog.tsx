import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useState, useEffect } from 'react'

interface ChangeDisplayNameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentDisplayName: string
  onSubmit: (displayName: string) => void
  isLoading: boolean
}

export function ChangeDisplayNameDialog({
  open,
  onOpenChange,
  currentDisplayName,
  onSubmit,
  isLoading,
}: ChangeDisplayNameDialogProps) {
  const [displayName, setDisplayName] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setDisplayName(currentDisplayName)
      setTouched(false)
    }
  }, [open, currentDisplayName])

  const error = touched && !displayName.trim() ? 'Display name is required.' : ''

  const handleSubmit = () => {
    setTouched(true)
    if (!displayName.trim()) return
    onSubmit(displayName.trim())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Display Name</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="change-display-name">Display Name</Label>
          <Input
            id="change-display-name"
            placeholder="Enter display name"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value)
              setTouched(true)
            }}
            className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter showCloseButton>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
