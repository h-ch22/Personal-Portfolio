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
import { validatePassword } from '#/api/admin/admin'
import { useState, useEffect } from 'react'
import { CONFIG } from '#/config'

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (email: string, displayName: string, password: string) => void
  isLoading: boolean
}

function getEmailError(value: string): string {
  if (!value) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return 'Enter a valid email address.'
  return ''
}

function getDisplayNameError(value: string): string {
  if (!value.trim()) return 'Display name is required.'
  return ''
}

function getConfirmPasswordError(password: string, confirm: string): string {
  if (!confirm) return 'Please confirm your password.'
  if (password !== confirm) return 'Passwords do not match.'
  return ''
}

export function AddUserDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AddUserDialogProps) {
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [touched, setTouched] = useState({
    email: false,
    displayName: false,
    password: false,
    confirmPassword: false,
  })

  useEffect(() => {
    if (!open) {
      setEmail('')
      setDisplayName('')
      setPassword('')
      setConfirmPassword('')
      setTouched({
        email: false,
        displayName: false,
        password: false,
        confirmPassword: false,
      })
    }
  }, [open])

  const emailError = touched.email ? getEmailError(email) : ''
  const displayNameError = touched.displayName
    ? getDisplayNameError(displayName)
    : ''
  const passwordError = touched.password
    ? (validatePassword(password) ?? '')
    : ''
  const confirmPasswordError = touched.confirmPassword
    ? getConfirmPasswordError(password, confirmPassword)
    : ''

  const isValid =
    !getEmailError(email) &&
    !getDisplayNameError(displayName) &&
    !validatePassword(password) &&
    !getConfirmPasswordError(password, confirmPassword)

  const handleSubmit = () => {
    setTouched({
      email: true,
      displayName: true,
      password: true,
      confirmPassword: true,
    })
    if (!isValid) return
    onSubmit(email.trim(), displayName.trim(), password)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Admin Account</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-email">Email</Label>
            <Input
              id="add-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setTouched((t) => ({ ...t, email: true }))
              }}
              className={
                emailError
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
            />
            {emailError && (
              <p className="text-xs text-destructive">{emailError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-displayName">Display Name</Label>
            <Input
              id="add-displayName"
              placeholder={CONFIG.meta.title}
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value)
                setTouched((t) => ({ ...t, displayName: true }))
              }}
              className={
                displayNameError
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
            />
            {displayNameError && (
              <p className="text-xs text-destructive">{displayNameError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-password">Password</Label>
            <Input
              id="add-password"
              type="password"
              placeholder="Min 8 chars — upper, lower, number, special"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setTouched((t) => ({ ...t, password: true }))
              }}
              className={
                passwordError
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
            />
            {passwordError && (
              <p className="text-xs text-destructive">{passwordError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-confirm-password">Confirm Password</Label>
            <Input
              id="add-confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setTouched((t) => ({ ...t, confirmPassword: true }))
              }}
              className={
                confirmPasswordError
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
            />
            {confirmPasswordError && (
              <p className="text-xs text-destructive">{confirmPasswordError}</p>
            )}
          </div>
        </div>

        <DialogFooter showCloseButton>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
