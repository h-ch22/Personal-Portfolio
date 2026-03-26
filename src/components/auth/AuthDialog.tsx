import * as z from "zod";

import { LogInIcon, UserIcon } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuthStore } from "#/stores/use-auth-store";
import { useAlertDialogStore } from "#/stores/use-alert-dialog-store";

export default function AuthDialog() {
    const user = useAuthStore((state) => state.user);
    const { openDialog } = useAlertDialogStore();

    const logInSchema = z.object({
        email: z
            .string()
            .min(1, "Email is required")
            .email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(1, "Password is required")
    });

    const form = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        onSubmit: async ({ value }) => {
            toast.promise<string>(
                () => new Promise((resolve) => {

                }),
                {
                    loading: `Logging in as ${value.email}...`,
                    success: (data) => `Welcome!`,
                    error: (err) => `Login failed: ${err.message}`
                }
            )
        }
    });

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            toast.success(`Welcome, ${user.displayName}!`);
        } catch(e: any) {
            toast.error(`Google login failed: ${e.message}`);
        }
    }

    const handleLogout = async () => {
        openDialog({
            title: "Confirm Logout",
            description: "Are you sure you want to log out?",
            onConfirm: async () => {
                toast.promise(
                    signOut(auth!),
                    {
                        loading: "Logging out...",
                        success: "Logged out successfully",
                        error: (err) => `Logout failed: ${err.message}`
                    }
                );
            },
            isDestructive: true,
        })

    }

    return (
        <div className="flex flex-col gap-4">
            { useAuthStore((user) => user.user) === null
                ? <>
                <div className="flex flex-row items-center gap-2 font-semibold text-foreground">
                    <LogInIcon className="w-4 h-4" />
                    { "Login to your account" }
                </div>

                <div className="text-sm text-muted-foreground">
                    { "Enter your credentials to access your account" }
                </div>

                <form
                    id="auth-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    noValidate
                >
                    <FieldGroup>
                        <form.Field
                            name="email"
                            validators={{
                                onChange: logInSchema.shape.email
                            }}
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name} className="text-muted-foreground">Email</FieldLabel>
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

                                        { isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />

                        <form.Field
                            name="password"
                            validators={{
                                onChange: logInSchema.shape.password
                            }}
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name} className="text-muted-foreground">Password</FieldLabel>
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

                                        { isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                    </FieldGroup>
                </form>

                <Field orientation="vertical">
                    <Button type="submit" form="auth-form">
                        Login
                    </Button>

                    <div className="text-sm text-muted-foreground text-center">or</div>

                    <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2 text-foreground"
                        onClick={() => handleGoogleLogin()}
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            className="w-5 h-5" 
                        />
                        Sign in with Google
                    </Button>
                </Field>
                </>
                : <>
                    <div className="flex flex-row items-center gap-2 font-semibold">
                        <UserIcon className="w-4 h-4" />
                        { `Hi, ${user?.displayName}!` }
                    </div>

                    <Button variant="destructive" onClick={() => handleLogout()}>
                        Logout
                    </Button>
                </>
            }

        </div>
    )
}