import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./App";
import { AuthContextProvider } from "./contexts/authContextProvider";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
	<AuthContextProvider>
		<Toaster
			position="top-right"
			toastOptions={{
				duration: 3000,
			}}
		/>
		<RouterProvider router={router} />
	</AuthContextProvider>
);
