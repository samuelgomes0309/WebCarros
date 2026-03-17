import type { UseFormRegister } from "react-hook-form";
import type { DashFormData } from "../new/schema";

interface InputProps {
	type: string;
	placeholder: string;
	errors?: string;
	focus: string | null;
	label: string;
	name: keyof DashFormData;
	register: UseFormRegister<DashFormData>;
	setFocus: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Input({
	placeholder,
	type,
	errors,
	setFocus,
	focus,
	name,
	label,
	register,
}: InputProps) {
	const hasError = Boolean(errors);
	return (
		<div className="flex flex-col w-full">
			<label className="py-2 font-medium text-black">{label}</label>
			<input
				className={`px-4 py-1.5 border  w-full  border-gray-400 rounded-xl placeholder-gray-800  ${!hasError && focus === name ? "outline outline-blue-400" : "outline-0"}   ${hasError && "outline-1 outline-red-500"}`}
				type={type}
				placeholder={placeholder}
				{...register(name)}
				onBlur={() => setFocus(null)}
				onFocus={() => setFocus(name)}
			/>
			{hasError && (
				<span className="font-semibold text-red-500 py-0.5">{errors}</span>
			)}
		</div>
	);
}
