import { createContext, type ReactNode } from "react";
import type { SignInData, SignUpData } from "../pages/login/schema";

export interface AuthContextProps {
	children: ReactNode;
}

export interface AuthContextData {
	user: UserProps | null;
	signed: boolean;
	loadingAuth: boolean;
	handleSignIn: (data: SignInData) => Promise<boolean>;
	handleSignUp: (data: SignUpData) => Promise<boolean>;
	logOut: () => Promise<void>;
}

export interface UserProps {
	uid: string;
	email: string;
	name: string;
}

export const AuthContext = createContext<AuthContextData | null>(null);
