export type SocialPlatform =
    | 'Instagram'
    | 'Email'
    | 'LinkedIn'
    | 'GitHub'
    | 'X (Twitter)'
    | 'YouTube'
    | 'Website'
    | 'Other'

export type SocialLink = {
    id: string
    platform: SocialPlatform
    url: string
    label?: string
}

export type SocialLinkRequest = Omit<SocialLink, 'id'>

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  'Instagram',
  'Email',
  'LinkedIn',
  'GitHub',
  'X (Twitter)',
  'YouTube',
  'Website',
  'Other',
]
