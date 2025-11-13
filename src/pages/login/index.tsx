import React, { useState } from "react";
import SignIn from "./signin";
import SignUp from "./signup";

export interface LoginProps {
	setLogin: React.Dispatch<React.SetStateAction<boolean>>;
	isLogin: boolean;
}

export default function Login() {
	const [isLogin, setIsLogin] = useState<boolean>(true);
	return isLogin ? (
		<SignIn isLogin={isLogin} setLogin={setIsLogin} />
	) : (
		<SignUp isLogin={isLogin} setLogin={setIsLogin} />
	);
}
