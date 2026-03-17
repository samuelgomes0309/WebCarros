import { Outlet } from "react-router";
import Header from "../header";

export default function Layout() {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
}
