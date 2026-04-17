import { initializeApp, deleteApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updatePassword,
  signOut,
} from 'firebase/auth'
import {
  collection,
  deleteField,
  doc,
  getDocs,
  query,
  updateDoc,
  setDoc,
} from 'firebase/firestore'
import { auth, firestore as db } from '@/lib/firebase'
import { CONFIG } from '#/config'
import type { AdminUser } from '#/types/admin'

export const getAllUsers = async (): Promise<AdminUser[]> => {
  if (!db) throw new Error('Database not available')
  const usersRef = collection(db, 'Users')
  const snapshot = await getDocs(query(usersRef))
  return snapshot.docs.map((d) => ({
    uid: d.id,
    ...(d.data() as Omit<AdminUser, 'uid'>),
  }))
}

export const sendPasswordReset = async (email: string): Promise<void> => {
  if (!auth) throw new Error('Auth not available')
  await firebaseSendPasswordResetEmail(auth, email)
}

export const revokeAdmin = async (uid: string): Promise<void> => {
  if (!db) throw new Error('Database not available')
  const userRef = doc(db, 'Users', uid)
  await updateDoc(userRef, { isAdmin: false, role: deleteField() })
}

export const grantAdmin = async (uid: string): Promise<void> => {
  if (!db) throw new Error('Database not available')
  const userRef = doc(db, 'Users', uid)
  await updateDoc(userRef, { isAdmin: true, role: 'Administrator' })
}

export const createAdminUser = async (
  email: string,
  password: string,
  displayName: string,
): Promise<string> => {
  if (!db) throw new Error('Database not available')

  const secondaryAppName = `secondary-${Date.now()}`
  const secondaryApp = initializeApp(CONFIG.firebaseConfig, secondaryAppName)
  const secondaryAuth = getAuth(secondaryApp)

  try {
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      password,
    )
    const uid = userCredential.user.uid

    await setDoc(doc(db, 'Users', uid), {
      Email: email,
      displayName,
      isAdmin: true,
      role: 'Administrator',
    })

    return uid
  } finally {
    await signOut(secondaryAuth)
    await deleteApp(secondaryApp)
  }
}

export const changeDisplayName = async (
  uid: string,
  displayName: string,
): Promise<void> => {
  if (!db) throw new Error('Database not available')
  await updateDoc(doc(db, 'Users', uid), { displayName })
}

export const changeCurrentUserPassword = async (
  newPassword: string,
): Promise<void> => {
  if (!auth?.currentUser) throw new Error('There is no logged-in user.')
  await updatePassword(auth.currentUser, newPassword)
}

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Password must be at least 8 characters long.'
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter.'
  if (!/[0-9]/.test(password)) return 'Password must contain a number.'
  if (!/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?`~]/.test(password))
    return 'Password must contain a special character.'
  return null
}
