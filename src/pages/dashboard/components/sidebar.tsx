import { useContext } from "react";
import { Link, useLocation } from "react-router";
import { AuthContext } from "../../../contexts/authContext";

export default function SidebarDashboard() {
	const location = useLocation();
	const { logOut } = useContext(AuthContext)!;
	return (
		<nav className=" bg-red-500 text-white font-medium  w-full rounded-xl flex justify-between px-4 items-center ">
			<ul className=" flex gap-6 py-2">
				<li
					className={`${location.pathname === "/dashboard" ? "underline underline-offset-4" : ""} transition duration-300 hover:scale-102`}
				>
					<Link to={"/dashboard"}>Dashboard</Link>
				</li>
				<li
					className={`${location.pathname === "/dashboard/new" ? "underline underline-offset-4" : ""} transition duration-300 hover:scale-102`}
				>
					<Link to={"/dashboard/new"}>Novo carro</Link>
				</li>
			</ul>
			<button
				type="button"
				onClick={logOut}
				className="transition duration-300 hover:scale-102 cursor-pointer"
			>
				Sair da conta
			</button>
		</nav>
	);
}
