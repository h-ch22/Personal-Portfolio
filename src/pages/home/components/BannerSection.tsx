import yujee from '#/assets/images/yujee.png'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Spinner } from '#/components/ui/spinner'
import {
  CameraIcon,
  CheckIcon,
  LoaderCircleIcon,
  PencilIcon,
  XIcon,
} from 'lucide-react'
import type { RefObject } from 'react'
import type { User } from 'firebase/auth'

interface BannerSectionProps {
  isLoaded: boolean
  showContent: boolean
  bannerImage: string | null | undefined
  bannerText: string
  isEditingBanner: boolean
  bannerTextInput: string
  setBannerTextInput: (v: string) => void
  isSavingBanner: boolean
  handleBannerEditStart: () => void
  handleBannerSave: () => void
  handleBannerCancel: () => void
  bannerImageInputRef: RefObject<HTMLInputElement | null>
  isUploadingBannerImage: boolean
  handleBannerImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  user: User | null
  isAdmin: boolean
}

export function BannerSection({
  isLoaded,
  showContent,
  bannerImage,
  bannerText,
  isEditingBanner,
  bannerTextInput,
  setBannerTextInput,
  isSavingBanner,
  handleBannerEditStart,
  handleBannerSave,
  handleBannerCancel,
  bannerImageInputRef,
  isUploadingBannerImage,
  handleBannerImageChange,
  user,
  isAdmin,
}: BannerSectionProps) {
  return (
    <div
      className={`flex w-full h-screen items-center justify-center bg-primary transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      {isLoaded ? (
        <div
          className={`flex flex-col items-center gap-6 transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="relative group/img">
            <img
              src={bannerImage || yujee}
              className="object-contain w-96 h-96"
            />
            {user && isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => bannerImageInputRef.current?.click()}
                  disabled={isUploadingBannerImage}
                  className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/30"
                >
                  {isUploadingBannerImage ? (
                    <LoaderCircleIcon className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <CameraIcon className="w-8 h-8 text-white" />
                  )}
                </button>
                <input
                  ref={bannerImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerImageChange}
                />
              </>
            )}
          </div>

          {isEditingBanner ? (
            <div className="flex flex-col items-center gap-3">
              <Input
                value={bannerTextInput}
                onChange={(e) => setBannerTextInput(e.target.value)}
                className="font-great-vibes text-4xl text-center bg-white/10 text-white border-white/30 placeholder:text-white/50 w-80"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleBannerSave()
                  if (e.key === 'Escape') handleBannerCancel()
                }}
                autoFocus
              />
              <div className="flex flex-row gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleBannerSave}
                  disabled={isSavingBanner}
                >
                  <CheckIcon className="w-4 h-4" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleBannerCancel}
                  className="text-white hover:bg-white/10"
                >
                  <XIcon className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative group flex items-center gap-2">
              <div className="font-great-vibes text-7xl text-white text-center">
                {bannerText}
              </div>
              {user && isAdmin && (
                <button
                  type="button"
                  onClick={handleBannerEditStart}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  )
}
