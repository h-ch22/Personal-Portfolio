import { Spinner } from '#/components/ui/spinner'

const LoadingPage = () => {
  return (
    <div className="w-full h-full flex flex-col flex-1 justify-center items-center">
      <Spinner />
    </div>
  )
}

export { LoadingPage }
