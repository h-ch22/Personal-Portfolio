import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  KeyRoundIcon,
  MailIcon,
  PenLineIcon,
  PlusIcon,
  ShieldOffIcon,
  ShieldIcon,
  ShieldCheckIcon,
} from 'lucide-react'
import { AddUserDialog } from './components/AddUserDialog'
import { ChangePasswordDialog } from './components/ChangePasswordDialog'
import { ChangeDisplayNameDialog } from './components/ChangeDisplayNameDialog'
import { useAdminPageController } from './hooks/useAdminPage'
import { motion } from 'framer-motion'

export function AdminPage() {
  const {
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
  } = useAdminPageController()

  return (
    <div className="w-full flex flex-1 flex-col px-4 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col gap-5 mb-8"
      >
        <div className="flex flex-row items-end justify-between mt-4">
          <div className="flex flex-col gap-2.5">
            <Badge
              variant="secondary"
              className="w-fit flex items-center gap-1.5 px-2.5 py-0.5 bg-muted/50 text-muted-foreground font-mono text-xs border-transparent"
            >
              <ShieldIcon className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Badge>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-linear-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
                Admin
              </span>
            </h1>

            <p className="text-muted-foreground text-sm font-medium">
              Manage admin accounts and update your password.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowChangeDisplayNameDialog(true)}
            >
              <PenLineIcon className="w-4 h-4" />
              Change Name
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowChangePasswordDialog(true)}
            >
              <KeyRoundIcon className="w-4 h-4" />
              Change Password
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAddUserDialog(true)}
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-border via-border/40 to-transparent" />
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-lg border"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">
                    {user.displayName}
                    {currentUser?.uid === user.uid && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        You
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.Email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        !user.isAdmin
                          ? 'outline'
                          : user.role === 'Developer'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {!user.isAdmin ? 'User' : user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                        disabled={isSendingReset || user.role === 'Developer'}
                        onClick={() => handleSendPasswordReset(user)}
                      >
                        <MailIcon className="w-4 h-4" />
                        Send Password Reset Link
                      </Button>
                      {user.isAdmin ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-destructive hover:text-destructive"
                          disabled={!canRevoke(user) || isRevokingAdmin}
                          onClick={() => handleRevokeAdmin(user)}
                        >
                          <ShieldOffIcon className="w-4 h-4" />
                          Revoke Admin
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5"
                          disabled={isGrantingAdmin}
                          onClick={() => handleGrantAdmin(user)}
                        >
                          <ShieldCheckIcon className="w-4 h-4" />
                          Grant Admin
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {adminUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    No admins found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <p className="px-3 py-2 text-xs text-muted-foreground border-t">
            Admin access cannot be revoked for Developer role users. Password
            reset links are also unavailable for Developer role users.
          </p>
        </motion.div>
      )}

      <AddUserDialog
        open={showAddUserDialog}
        onOpenChange={setShowAddUserDialog}
        onSubmit={handleAddUser}
        isLoading={isCreatingUser}
      />

      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
        onSubmit={handleChangePassword}
        isLoading={isChangingPassword}
      />

      <ChangeDisplayNameDialog
        open={showChangeDisplayNameDialog}
        onOpenChange={setShowChangeDisplayNameDialog}
        currentDisplayName={
          adminUsers.find((u) => u.uid === currentUser?.uid)?.displayName ?? ''
        }
        onSubmit={handleChangeDisplayName}
        isLoading={isChangingDisplayName}
      />
    </div>
  )
}
