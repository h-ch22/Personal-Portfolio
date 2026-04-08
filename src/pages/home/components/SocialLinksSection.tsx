import { AnimatedItem } from '#/components/common/AnimatedItem'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  SOCIAL_PLATFORMS,
  type SocialLink,
  type SocialLinkRequest,
  type SocialPlatform,
} from '#/types/sociallink'
import {
  ExternalLinkIcon,
  GlobeIcon,
  MailIcon,
  PlusIcon,
  XIcon,
} from 'lucide-react'
import type { User } from 'firebase/auth'
import { SocialPlatformIcon } from './SocialPlatformIcon'

interface SocialLinksSectionProps {
  socialLinks: SocialLink[]
  user: User | null
  isAdmin: boolean
  showAddSocialLink: boolean
  setShowAddSocialLink: (v: boolean) => void
  socialLinkForm: SocialLinkRequest
  setSocialLinkForm: React.Dispatch<React.SetStateAction<SocialLinkRequest>>
  isAddingSocialLink: boolean
  addSocialLink: (form: SocialLinkRequest) => void
  removeSocialLink: (id: string) => void
}

export function SocialLinksSection({
  socialLinks,
  user,
  isAdmin,
  showAddSocialLink,
  setShowAddSocialLink,
  socialLinkForm,
  setSocialLinkForm,
  isAddingSocialLink,
  addSocialLink,
  removeSocialLink,
}: SocialLinksSectionProps) {
  return (
    <>
      <AnimatedItem>
        <div className="flex flex-col gap-6 bg-secondary px-6 py-10">
          <div className="flex flex-row items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                🫰🏻 Get in touch!
              </div>
              <p className="text-muted-foreground mt-1">
                Feel free to reach out through any of these platforms
              </p>
            </div>
            {user && isAdmin && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAddSocialLink(true)}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            )}
          </div>

          {socialLinks.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              No social links added yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              {socialLinks.map((link, i) => {
                const isEmail = link.platform === 'Email'
                const href = isEmail ? `mailto:${link.url}` : link.url
                const Icon =
                  link.platform === 'Email'
                    ? MailIcon
                    : link.platform === 'Website'
                      ? GlobeIcon
                      : ExternalLinkIcon

                return (
                  <AnimatedItem key={link.id} index={i}>
                    <div className="relative group/link">
                      <a
                        href={href}
                        target={isEmail ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-card hover:bg-muted transition-colors"
                      >
                        <SocialPlatformIcon
                          platform={link.platform}
                          className="w-6 h-6 shrink-0"
                        />
                        <div className="flex flex-col leading-tight">
                          <span className="text-sm font-medium">
                            {link.label || link.platform}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <Icon className="w-3 h-3" />
                            {isEmail ? link.url : link.platform}
                          </span>
                        </div>
                      </a>
                      {user && isAdmin && (
                        <button
                          type="button"
                          onClick={() => removeSocialLink(link.id)}
                          className="absolute -top-1.5 -right-1.5 opacity-0 group-hover/link:opacity-100 transition-opacity p-0.5 rounded-full bg-destructive text-destructive-foreground"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </AnimatedItem>
                )
              })}
            </div>
          )}
        </div>
      </AnimatedItem>

      <Dialog open={showAddSocialLink} onOpenChange={setShowAddSocialLink}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Social Link</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Platform</label>
              <Select
                value={socialLinkForm.platform}
                onValueChange={(val) =>
                  setSocialLinkForm((prev) => ({
                    ...prev,
                    platform: val as SocialPlatform,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      <SocialPlatformIcon platform={p} className="w-4 h-4" />{' '}
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                {socialLinkForm.platform === 'Email' ? 'Email Address' : 'URL'}
              </label>
              <Input
                placeholder={
                  socialLinkForm.platform === 'Email'
                    ? 'e.g. hello@example.com'
                    : 'https://...'
                }
                value={socialLinkForm.url}
                onChange={(e) =>
                  setSocialLinkForm((prev) => ({ ...prev, url: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                Label{' '}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <Input
                placeholder="e.g. @yujee_chang"
                value={socialLinkForm.label ?? ''}
                onChange={(e) =>
                  setSocialLinkForm((prev) => ({
                    ...prev,
                    label: e.target.value,
                  }))
                }
              />
            </div>

            {socialLinkForm.url && (
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted">
                <SocialPlatformIcon
                  platform={socialLinkForm.platform}
                  className="w-8 h-8"
                />
                <div>
                  <div className="font-medium">
                    {socialLinkForm.label || socialLinkForm.platform}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {socialLinkForm.url}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddSocialLink(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => addSocialLink(socialLinkForm)}
              disabled={!socialLinkForm.url.trim() || isAddingSocialLink}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
