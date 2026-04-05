import * as z from 'zod'

import { LogInIcon, ShieldCheckIcon, UserIcon } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useAuthStore } from '#/stores/use-auth-store'
import { useAlertDialogStore } from '#/stores/use-alert-dialog-store'
import { logIn, logOut } from '#/api/auth/auth'
import { useState } from 'react'

export default function AuthDialog() {
  const { openDialog } = useAlertDialogStore()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const logInSchema = z.object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email({ message: 'Invalid email address' }),
    password: z.string().min(1, 'Password is required'),
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setIsLoggingIn(true)

      const logInPromise = logIn(value.email, value.password)

      await toast.promise<string>(logInPromise, {
        loading: `Logging in as ${value.email}...`,
        success: (result) => result,
        error: (err) => `Login failed: ${err.message}`,
        finally: () => {
          setIsLoggingIn(false)
        },
      })

      try {
        await logInPromise
        form.reset()
      } catch (e: any) {
        // bypass
      }
    },
  })

  const handleLogout = async () => {
    openDialog({
      title: 'Confirm Logout',
      description: 'Are you sure you want to log out?',
      onConfirm: async () => {
        toast.promise(logOut(), {
          loading: 'Logging out...',
          success: (result) => result,
          error: (err) => `Logout failed: ${err.message}`,
        })
      },
      isDestructive: true,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {useAuthStore((user) => user.user) === null ? (
        <>
          <div className="flex flex-row items-center gap-2 font-semibold text-foreground">
            <LogInIcon className="w-4 h-4" />
            {'Login to your account'}
          </div>

          <div className="text-sm text-muted-foreground">
            {'Enter your credentials to access your account'}
          </div>

          <form
            id="auth-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            noValidate
          >
            <FieldGroup>
              <form.Field
                name="email"
                validators={{
                  onChange: logInSchema.shape.email,
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-muted-foreground"
                      >
                        Email
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="example@example.com"
                        autoComplete="off"
                        type="email"
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="password"
                validators={{
                  onChange: logInSchema.shape.password,
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-muted-foreground"
                      >
                        Password
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="••••••••"
                        autoComplete="off"
                        type="password"
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </form>

          <Field orientation="vertical">
            <Button type="submit" form="auth-form" disabled={isLoggingIn}>
              Login
            </Button>
          </Field>
        </>
      ) : (
        <>
          <div className="flex flex-row items-center gap-2 font-semibold">
            <UserIcon className="w-4 h-4" />
            {`Hi, ${useAuthStore.getState().userName}!`}
          </div>

          {useAuthStore.getState().isAdmin && (
            <div className="flex flex-row items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
              <ShieldCheckIcon className="w-4 h-4" />
              {'Admin'}
            </div>
          )}

          <Button variant="destructive" onClick={() => handleLogout()}>
            Logout
          </Button>
        </>
      )}
    </div>
  )
}
