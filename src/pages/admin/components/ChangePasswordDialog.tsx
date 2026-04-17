import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { validatePassword } from '#/api/admin/admin'
import { useState, useEffect } from 'react'

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (newPassword: string) => void
  isLoading: boolean
}

function getConfirmError(password: string, confirm: string): string {
  if (!confirm) return 'Please confirm your password.'
  if (password !== confirm) return 'Passwords do not match.'
  return ''
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  })

  useEffect(() => {
    if (!open) {
      setNewPassword('')
      setConfirmPassword('')
      setTouched({ newPassword: false, confirmPassword: false })
    }
  }, [open])

  const passwordError = touched.newPassword ? (validatePassword(newPassword) ?? '') : ''
  const confirmError = touched.confirmPassword
    ? getConfirmError(newPassword, confirmPassword)
    : ''

  const isValid = !validatePassword(newPassword) && !getConfirmError(newPassword, confirmPassword)

  const handleSubmit = () => {
    setTouched({ newPassword: true, confirmPassword: true })
    if (!isValid) return
    onSubmit(newPassword)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Must be at least 8 characters and include uppercase, lowercase, number, and special character.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setTouched((t) => ({ ...t, newPassword: true }))
              }}
              className={passwordError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {passwordError && (
              <p className="text-xs text-destructive">{passwordError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-new-password">Confirm Password</Label>
            <Input
              id="confirm-new-password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setTouched((t) => ({ ...t, confirmPassword: true }))
              }}
              className={confirmError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {confirmError && (
              <p className="text-xs text-destructive">{confirmError}</p>
            )}
          </div>
        </div>

        <DialogFooter showCloseButton>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Change Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
