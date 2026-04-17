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
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

export const useAdminPageController = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { openDialog } = useAlertDialogStore()
  const currentUser = useAuthStore((s) => s.user)

  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false)
  const [showChangeDisplayNameDialog, setShowChangeDisplayNameDialog] = useState(false)

  const { data: adminUsers = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAllUsers,
  })

  const { mutate: doSendReset, isPending: isSendingReset } = useMutation({
    mutationFn: (email: string) => sendPasswordReset(email),
  })

  const { mutate: doRevokeAdmin, isPending: isRevokingAdmin } = useMutation({
    mutationFn: ({ uid }: { uid: string; isSelf: boolean }) => revokeAdmin(uid),
    onSuccess: (_, { isSelf }) => {
      if (isSelf) {
        useAuthStore.setState({ isAdmin: false })
        navigate({ to: '/' })
      } else {
        queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      }
    },
  })

  const { mutate: doGrantAdmin, isPending: isGrantingAdmin } = useMutation({
    mutationFn: (uid: string) => grantAdmin(uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
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
      setShowAddUserDialog(false)
    },
  })

  const { mutate: doChangeDisplayName, isPending: isChangingDisplayName } = useMutation({
    mutationFn: ({ uid, displayName }: { uid: string; displayName: string }) =>
      changeDisplayName(uid, displayName),
    onSuccess: (_, { displayName }) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      useAuthStore.setState({ userName: displayName })
      setShowChangeDisplayNameDialog(false)
    },
  })

  const { mutate: doChangePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: (newPassword: string) => changeCurrentUserPassword(newPassword),
    onSuccess: () => {
      setShowChangePasswordDialog(false)
    },
  })

  const wrapMutationPromise = <T>(
    mutate: (vars: T, callbacks: { onSuccess: () => void; onError: (e: any) => void }) => void,
    vars: T,
  ) =>
    new Promise<void>((resolve, reject) => {
      mutate(vars, { onSuccess: resolve, onError: reject })
    })

  const handleSendPasswordReset = (user: AdminUser) => {
    openDialog({
      title: 'Send Password Reset Email',
      description: `Send a password reset link to ${user.Email}?`,
      onConfirm: () => {
        toast.promise(wrapMutationPromise(doSendReset, user.Email), {
          loading: 'Sending reset email...',
          success: 'Password reset email sent.',
          error: (e) => `Failed to send email: ${e.message}`,
        })
      },
    })
  }

  const executeRevoke = (uid: string, isSelf: boolean) => {
    toast.promise(wrapMutationPromise(doRevokeAdmin, { uid, isSelf }), {
      loading: 'Revoking admin access...',
      success: isSelf
        ? 'Your admin access has been revoked.'
        : 'Admin access revoked.',
      error: (e) => `Failed to revoke admin: ${e.message}`,
    })
  }

  const handleRevokeAdmin = (user: AdminUser) => {
    if (user.role === 'Developer') return
    const currentAdminCount = adminUsers.filter((u) => u.isAdmin).length
    if (currentAdminCount <= 1) {
      toast.error('At least one admin must remain.')
      return
    }

    const isSelf = user.uid === currentUser?.uid

    openDialog({
      title: isSelf ? 'Revoke Your Own Admin Access' : 'Revoke Admin Access',
      description: isSelf
        ? 'You are about to remove your own admin privileges. You will be redirected to the home page immediately.'
        : `Remove admin access for ${user.displayName}?`,
      isDestructive: true,
      onConfirm: () => executeRevoke(user.uid, isSelf),
    })
  }

  const handleGrantAdmin = (user: AdminUser) => {
    openDialog({
      title: 'Grant Admin Access',
      description: `Grant admin access to ${user.displayName}?`,
      onConfirm: () => {
        toast.promise(wrapMutationPromise(doGrantAdmin, user.uid), {
          loading: 'Granting admin access...',
          success: 'Admin access granted.',
          error: (e) => `Failed to grant admin: ${e.message}`,
        })
      },
    })
  }

  const canRevoke = (user: AdminUser) => {
    if (!user.isAdmin) return false
    if (user.role === 'Developer') return false
    const currentAdminCount = adminUsers.filter((u) => u.isAdmin).length
    return currentAdminCount > 1
  }

  const handleAddUser = (email: string, displayName: string, password: string) => {
    toast.promise(
      wrapMutationPromise(doCreateUser, { email, password, displayName }),
      {
        loading: 'Creating account...',
        success: 'Admin account created.',
        error: (e) => `Failed to create account: ${e.message}`,
      },
    )
  }

  const handleChangePassword = (newPassword: string) => {
    toast.promise(wrapMutationPromise(doChangePassword, newPassword), {
      loading: 'Changing password...',
      success: 'Password changed successfully.',
      error: (e) =>
        e.code === 'auth/requires-recent-login'
          ? 'Please sign in again before changing your password.'
          : `Failed to change password: ${e.message}`,
    })
  }

  const handleChangeDisplayName = (displayName: string) => {
    if (!currentUser) return
    toast.promise(
      wrapMutationPromise(doChangeDisplayName, {
        uid: currentUser.uid,
        displayName,
      }),
      {
        loading: 'Updating display name...',
        success: 'Display name updated.',
        error: (e) => `Failed to update display name: ${e.message}`,
      },
    )
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
