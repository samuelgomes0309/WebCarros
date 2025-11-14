import { useEffect, useState } from "react";
import {
	AuthContext,
	type AuthContextProps,
	type UserProps,
} from "./authContext";
import type { SignInData, SignUpData } from "../pages/login/schema";
import toast from "react-hot-toast";
import { auth } from "../services/firebase";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from "firebase/auth";

export function AuthContextProvider({ children }: AuthContextProps) {
	const [user, setUser] = useState<UserProps | null>(null);
	const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				setUser({
					email: currentUser.email ?? "",
					uid: currentUser.uid,
					name: currentUser.displayName ?? "",
				});
			} else {
				setUser(null);
			}
			setLoadingAuth(false);
		});
		return () => {
			unsubscribe();
		};
	}, []);
	async function handleSignIn(data: SignInData) {
		try {
			const { email, password } = data;
			const response = await signInWithEmailAndPassword(auth, email, password);
			setUser({
				uid: response.user.uid,
				email: response.user.email ?? email,
				name: response.user.displayName ?? "",
			});
			return true;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(error.message);
			return false;
		}
	}
	async function handleSignUp(data: SignUpData) {
		try {
			const { email, name, password } = data;
			const response = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await updateProfile(response.user, { displayName: name });
			setUser({
				uid: response.user.uid,
				email,
				name: name,
			});
			return true;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(error.message);
			return false;
		}
	}
	async function logOut() {
		try {
			await signOut(auth);
			setUser(null);
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<AuthContext.Provider
			value={{
				user,
				signed: !!user,
				loadingAuth,
				handleSignIn,
				handleSignUp,
				logOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
