import yujee from '#/assets/images/yujee.png'
import changjin from '#/assets/images/changjin.png'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import {
  CameraIcon,
  CheckIcon,
  LoaderCircleIcon,
  PencilIcon,
  XIcon,
} from 'lucide-react'
import type { RefObject } from 'react'
import type { User } from 'firebase/auth'

interface ProfileSectionProps {
  profileImage: string | null | undefined
  profileImageInputRef: RefObject<HTMLInputElement | null>
  isUploadingProfileImage: boolean
  handleProfileImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  homeDescription: string | undefined
  isEditingDescription: boolean
  descriptionInput: string
  setDescriptionInput: (v: string) => void
  isSavingDescription: boolean
  handleDescriptionEditStart: () => void
  handleDescriptionSave: () => void
  handleDescriptionCancel: () => void
  user: User | null
  isAdmin: boolean
}

export function ProfileSection({
  profileImage,
  profileImageInputRef,
  isUploadingProfileImage,
  handleProfileImageChange,
  homeDescription,
  isEditingDescription,
  descriptionInput,
  setDescriptionInput,
  isSavingDescription,
  handleDescriptionEditStart,
  handleDescriptionSave,
  handleDescriptionCancel,
  user,
  isAdmin,
}: ProfileSectionProps) {
  return (
    <div className="flex flex-col gap-4 bg-muted text-center py-4">
      <div className="flex flex-row items-center w-full gap-2 text-4xl font-semibold justify-center text-foreground">
        {'👋🏻 Hi there!'}
      </div>

      <div className="flex flex-row items-center justify-center">
        <div className="relative group/profile">
          <img
            src={
              profileImage ??
              (import.meta.env.VITE_TARGET_USER === 'changjin'
                ? changjin
                : yujee)
            }
            className="w-64"
          />
          {user && isAdmin && (
            <>
              <button
                type="button"
                onClick={() => profileImageInputRef.current?.click()}
                disabled={isUploadingProfileImage}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/profile:opacity-100 transition-opacity bg-black/30 rounded"
              >
                {isUploadingProfileImage ? (
                  <LoaderCircleIcon className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <CameraIcon className="w-8 h-8 text-white" />
                )}
              </button>
              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </>
          )}
        </div>
      </div>

      {isEditingDescription ? (
        <div className="flex flex-col items-center gap-3 px-6">
          <Textarea
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            rows={5}
            className="text-center resize-none"
            autoFocus
          />
          <div className="flex flex-row gap-2">
            <Button
              size="sm"
              onClick={handleDescriptionSave}
              disabled={isSavingDescription}
            >
              <CheckIcon className="w-4 h-4" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDescriptionCancel}
            >
              <XIcon className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative group/desc flex items-start justify-center gap-2 px-6">
          <p className="text-muted-foreground">{homeDescription}</p>
          {user && isAdmin && (
            <button
              type="button"
              onClick={handleDescriptionEditStart}
              className="shrink-0 mt-0.5 opacity-0 group-hover/desc:opacity-100 transition-opacity p-1 rounded-full hover:bg-muted-foreground/20"
            >
              <PencilIcon className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
