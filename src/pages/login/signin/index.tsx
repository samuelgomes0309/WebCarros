import { Link, useNavigate } from "react-router";
import type { LoginProps } from "..";
import logo from "../../../assets/logo.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { signInSchema, type SignInData } from "../schema";
import { AuthContext } from "../../../contexts/authContext";
import toast from "react-hot-toast";

export default function SignIn({ isLogin, setLogin }: LoginProps) {
	const { handleSignIn, logOut } = useContext(AuthContext)!;
	const [focus, setFocus] = useState<string | null>(null);
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInData>({
		resolver: zodResolver(signInSchema),
	});
	const nav = useNavigate();
	useEffect(() => {
		logOut();
		reset();
	}, [isLogin, logOut, reset]);
	async function onsubmit(data: SignInData) {
		const response = await handleSignIn(data);
		if (response) {
			toast.success("Login realizado!");
			nav("/dashboard");
			return;
		}
	}
	return (
		<div className="bg-gray-200 min-h-dvh min-w-dvw p-4 justify-center items-center flex">
			<div className="flex flex-col max-w-md gap-4 items-center w-full">
				<Link to={"/"} className="cursor-default ">
					<img src={logo} alt="WebCarros logo" className="h-16 w-full" />
				</Link>
				<form
					onSubmit={handleSubmit(onsubmit)}
					className="flex flex-col bg-white w-full px-4 rounded-xl py-5 "
				>
					<input
						className={`px-4 py-1.5 border  border-gray-400 rounded-xl placeholder-gray-800  ${!errors.email?.message && focus === "email" ? "outline outline-blue-400" : "outline-0"}   ${errors?.email?.message && "outline outline-red-500"}`}
						type="email"
						placeholder="Digite seu email..."
						{...register("email")}
						onBlur={() => setFocus(null)}
						onFocus={() => setFocus("email")}
					/>
					{errors?.email && (
						<span className="font-semibold text-red-500 py-0.5">
							{errors?.email.message}
						</span>
					)}
					<input
						className={`px-4 py-1.5 border my-2 border-gray-400 rounded-xl placeholder-gray-800  ${!errors.password?.message && focus === "password" ? "outline outline-blue-400" : "outline-0"}   ${errors?.password?.message && "outline outline-red-500"}`}
						type="password"
						placeholder="Digite sua senha"
						{...register("password")}
						onFocus={() => setFocus("password")}
						onBlur={() => setFocus(null)}
					/>
					{errors?.password && (
						<span className="font-semibold text-red-500 py-0.5">
							{errors?.password.message}
						</span>
					)}
					<button
						type="submit"
						disabled={isSubmitting}
						onBlur={() => setFocus(null)}
						className={`w-full cursor-pointer transition duration-300 hover:bg-zinc-800/95 bg-zinc-900 rounded-xl py-1.5 text-white font-bold disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-black`}
					>
						{isSubmitting ? (
							<span className="animate-pulse"> Cadastrando...</span>
						) : (
							"Cadastrar"
						)}
					</button>
				</form>
				<button
					type="button"
					onClick={() => setLogin(false)}
					disabled={isSubmitting}
				>
					Não possui uma conta? Crie uma
				</button>
			</div>
		</div>
	);
}
