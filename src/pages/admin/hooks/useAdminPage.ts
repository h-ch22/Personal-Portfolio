import {
  getAllUsers,
  revokeAdmin,
  grantAdmin,
  sendPasswordReset,
  createAdminUser,
  changeCurrentUserPassword,
  changeDisplayName,
} from '#/api/admin/admin'
import { useAlertDialogStore } from '#/stores/use-alert-dialog-store'
import { useAuthStore } from '#/stores/use-auth-store'
import type { AdminUser } from '#/types/admin'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export const useAdminPageController = () => {
  const queryClient = useQueryClient()
  const { openDialog } = useAlertDialogStore()
  const currentUser = useAuthStore((s) => s.user)

  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false)
  const [showChangeDisplayNameDialog, setShowChangeDisplayNameDialog] = useState(false)

  const { data: adminUsers = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAllUsers,
  })

  const { mutate: sendReset, isPending: isSendingReset } = useMutation({
    mutationFn: (email: string) => sendPasswordReset(email),
    onSuccess: () => {
      toast.success('Password reset email sent.')
    },
    onError: (e: any) => {
      toast.error('Failed to send email: ' + e.message)
    },
  })

  const { mutate: doRevokeAdmin, isPending: isRevokingAdmin } = useMutation({
    mutationFn: (uid: string) => revokeAdmin(uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      toast.success('Admin access revoked.')
    },
    onError: (e: any) => {
      toast.error('Failed to revoke admin: ' + e.message)
    },
  })

  const { mutate: doGrantAdmin, isPending: isGrantingAdmin } = useMutation({
    mutationFn: (uid: string) => grantAdmin(uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      toast.success('Admin access granted.')
    },
    onError: (e: any) => {
      toast.error('Failed to grant admin: ' + e.message)
    },
  })

  const { mutate: doCreateUser, isPending: isCreatingUser } = useMutation({
    mutationFn: ({
      email,
      password,
      displayName,
    }: {
      email: string
      password: string
      displayName: string
    }) => createAdminUser(email, password, displayName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      toast.success('Admin account created.')
      setShowAddUserDialog(false)
    },
    onError: (e: any) => {
      toast.error('Failed to create account: ' + e.message)
    },
  })

  const { mutate: doChangeDisplayName, isPending: isChangingDisplayName } = useMutation({
    mutationFn: ({ uid, displayName }: { uid: string; displayName: string }) =>
      changeDisplayName(uid, displayName),
    onSuccess: (_, { displayName }) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      useAuthStore.setState({ userName: displayName })
      toast.success('Display name updated.')
      setShowChangeDisplayNameDialog(false)
    },
    onError: (e: any) => {
      toast.error('Failed to update display name: ' + e.message)
    },
  })

  const { mutate: doChangePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: (newPassword: string) => changeCurrentUserPassword(newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully.')
      setShowChangePasswordDialog(false)
    },
    onError: (e: any) => {
      if (e.code === 'auth/requires-recent-login') {
        toast.error('Please sign in again before changing your password.')
      } else {
        toast.error('Failed to change password: ' + e.message)
      }
    },
  })

  const handleSendPasswordReset = (user: AdminUser) => {
    openDialog({
      title: 'Send Password Reset Email',
      description: `Send a password reset link to ${user.Email}?`,
      confirmButtonText: 'Send',
      dismissButtonText: 'Cancel',
      onConfirm: () => sendReset(user.Email),
    })
  }

  const handleRevokeAdmin = (user: AdminUser) => {
    if (user.role === 'Developer') return
    const currentAdminCount = adminUsers.filter((u) => u.isAdmin).length
    if (currentAdminCount <= 1) {
      toast.error('At least one admin must remain.')
      return
    }
    openDialog({
      title: 'Revoke Admin Access',
      description: `Remove admin access for ${user.displayName}?`,
      confirmButtonText: 'Revoke',
      dismissButtonText: 'Cancel',
      isDestructive: true,
      onConfirm: () => doRevokeAdmin(user.uid),
    })
  }

  const handleGrantAdmin = (user: AdminUser) => {
    openDialog({
      title: 'Grant Admin Access',
      description: `Grant admin access to ${user.displayName}?`,
      confirmButtonText: 'Grant',
      dismissButtonText: 'Cancel',
      onConfirm: () => doGrantAdmin(user.uid),
    })
  }

  const canRevoke = (user: AdminUser) => {
    if (!user.isAdmin) return false
    if (user.role === 'Developer') return false
    const currentAdminCount = adminUsers.filter((u) => u.isAdmin).length
    return currentAdminCount > 1
  }

  const handleAddUser = (email: string, displayName: string, password: string) => {
    doCreateUser({ email, password, displayName })
  }

  const handleChangePassword = (newPassword: string) => {
    doChangePassword(newPassword)
  }

  const handleChangeDisplayName = (displayName: string) => {
    if (!currentUser) return
    doChangeDisplayName({ uid: currentUser.uid, displayName })
  }

  return {
    currentUser,
    adminUsers,
    isLoading,
    isSendingReset,
    isRevokingAdmin,
    isGrantingAdmin,
    isCreatingUser,
    isChangingPassword,
    isChangingDisplayName,
    showAddUserDialog,
    setShowAddUserDialog,
    showChangePasswordDialog,
    setShowChangePasswordDialog,
    showChangeDisplayNameDialog,
    setShowChangeDisplayNameDialog,
    handleSendPasswordReset,
    handleRevokeAdmin,
    handleGrantAdmin,
    canRevoke,
    handleAddUser,
    handleChangePassword,
    handleChangeDisplayName,
  }
}
