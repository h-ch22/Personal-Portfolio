import { useRouterState } from "@tanstack/react-router"
import error from "@/assets/images/error.png"
import { Button } from "#/components/ui/button";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";

export default function ErrorPage() {
    const state = useRouterState({ select: (s) => s.location.state });
    const code = state?.errorCode?.toString() ?? "Unknown Error";
    const messsage = state?.errorMessage ?? "An unknown error occurred. Please try again later.";

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <img src={error} className="w-96" />
            <div className="font-bold text-7xl text-primary">Oops!</div>
            <div className="text-2xl font-semibold">{`Error Code ${code}`}</div>
            <div className="text-lg text-muted-foreground">{messsage}</div>

            <div className="w-full flex flex-row items-center justify-center gap-2">
                <Button variant="outline" size="lg">
                    <ArrowLeftIcon />
                    Go to Previous Page
                </Button>

                <Button variant="default" size="lg">
                    <HomeIcon />
                    Go to Home Page
                </Button>
            </div>
        </div>
    )
}