import { createBrowserRouter } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import Detail from "./pages/detail";
import Dashboard from "./pages/dashboard";
import NewDash from "./pages/dashboard/new";
import Layout from "./components/layout";
import { Private } from "./routes/private";

export type RouterParams = {
	cardetail: {
		id: string;
	};
};

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/cardetail/:id",
				element: <Detail />,
			},
			{
				path: "/dashboard",
				element: (
					<Private>
						<Dashboard />
					</Private>
				),
			},
			{
				path: "/dashboard/new",
				element: (
					<Private>
						<NewDash />
					</Private>
				),
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
]);
