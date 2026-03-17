import type { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
	return (
		<div className="max-w-7xl  w-full px-4 mx-auto my-auto">{children}</div>
	);
}
