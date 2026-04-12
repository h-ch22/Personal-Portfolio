import { useRouter, useRouterState } from '@tanstack/react-router'
import yujeeError from '@/assets/images/error.yujee.png'
import changjinError from '@/assets/images/error.changjin.png'
import { Button } from '#/components/ui/button'
import { ArrowLeftIcon, HomeIcon } from 'lucide-react'

export default function ErrorPage() {
  const router = useRouter()
  const state = useRouterState({ select: (s) => s.location.state })
  const code = state?.errorCode?.toString() ?? 'Unknown'
  const messsage =
    state?.errorMessage ?? 'An unknown error occurred. Please try again later.'

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <img
        src={
          import.meta.env.VITE_TARGET_USER === 'changjin'
            ? changjinError
            : yujeeError
        }
        className="w-96"
      />
      <div className="font-bold text-7xl text-primary">Oops!</div>
      <div className="text-3xl font-semibold text-foreground">{`${code} Error`}</div>
      <div className="text-sm text-muted-foreground">{messsage}</div>

      <div className="w-full flex flex-row items-center justify-center gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.history.back()}
        >
          <ArrowLeftIcon />
          Go to Previous Page
        </Button>

        <Button
          variant="default"
          size="lg"
          onClick={() =>
            router.navigate({ to: '/', viewTransition: true, replace: true })
          }
        >
          <HomeIcon />
          Go to Home Page
        </Button>
      </div>
    </div>
  )
}
