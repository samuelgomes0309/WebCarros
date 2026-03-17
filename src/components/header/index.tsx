import { Link } from "react-router";
import logo from "../../assets/logo.svg";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { LogInIcon, UserCircle } from "lucide-react";

export default function Header() {
	const { signed, loadingAuth } = useContext(AuthContext)!;
	return (
		<header className="bg-white flex py-2.5 shadow justify-center px-5 mb-4">
			<div className="flex w-full justify-between items-center px-4 max-w-7xl">
				<Link
					to="/"
					className="flex justify-center items-center cursor-pointer transition duration-300 hover:scale-105"
				>
					<img src={logo} alt="WebCarros logo" />
				</Link>
				{!loadingAuth && (
					<>
						{!signed && (
							<Link
								to="/login"
								className="flex justify-center items-center transition duration-300 hover:scale-105"
							>
								<LogInIcon size={26} color="#000" />
							</Link>
						)}
						{signed && (
							<Link
								to="/dashboard"
								className="flex justify-center items-center transition duration-300 hover:scale-105"
							>
								<UserCircle size={26} color="#000" />
							</Link>
						)}
					</>
				)}
			</div>
		</header>
	);
}
