import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, firestore as db } from '@/lib/firebase'
import { useAuthStore } from '#/stores/use-auth-store'
import { doc, getDoc } from 'firebase/firestore'

export const logIn = async (email: string, password: string): Promise<string> => {
    if(!auth) {
        throw new Error("Authentication service is not available.")
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        const userInfo = await getUserInfo(user.uid);
        useAuthStore.setState({ user: user, userName: userInfo?.displayName, isAdmin: userInfo?.isAdmin || false })
        return `Welcome, ${user.displayName || user.email}`
    } catch (e: any) {
        throw e;
    }
}

export const getUserInfo = async (uid: string) => {
    try {
        if(!db) {
            throw new Error("Database is not available.")
        }

        const userRef = doc(db, "Users", uid);
        console.log(db.app)
        const userSnapshot = await getDoc(userRef);

        if(userSnapshot.exists()) {
            const userData = userSnapshot.data();
            return {
                isAdmin: userData.isAdmin || false,
                displayName: userData.displayName || null
            }
        } else {
            throw new Error("User not found.");
        }
    } catch(e: any) {
        throw new Error("Cannot fetch user data: " + e.message);
    }
}

export const logOut = async () => {
    if (!auth) {
        throw new Error("Authentication service is not available.")
    } else {
        try {
            await signOut(auth);
            useAuthStore.setState({ user: null, userName: null, isAdmin: false })
            return "Logged out successfully."
        } catch (e: any) {
            throw e;
        }
    }
}
