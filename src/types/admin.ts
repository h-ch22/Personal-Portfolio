export interface AdminUser {
  uid: string
  Email: string
  displayName: string
  isAdmin: boolean
  role: 'Developer' | 'Administrator'
}
