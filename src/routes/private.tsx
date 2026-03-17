import { useContext, type ReactNode } from "react";
import { AuthContext } from "../contexts/authContext";
import { Navigate } from "react-router";

export function Private({ children }: { children: ReactNode }) {
	const { signed, loadingAuth } = useContext(AuthContext)!;
	if (loadingAuth) {
		return (
			<div className="bg-gray-300 absolute flex min-h-screen w-screen top-0">
				<div className=" mx-auto my-auto flex items-center flex-col justify-center">
					<span className=" animate-bounce  text-2xl ">Carregando...</span>
					<div className="border-b-white border rounded-full size-16 animate-spin mt-5"></div>
				</div>
			</div>
		);
	}
	if (!signed) {
		return <Navigate to={"/login"} />;
	}
	return children;
}
