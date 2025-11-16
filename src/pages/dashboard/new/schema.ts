import z from "zod";

export const dashSchema = z.object({
	carName: z.string().nonempty("Nome do carro é obrigatório."),
	model: z.string().nonempty("Modelo do carro é obrigatório."),
	value: z
		.string()
		.min(1, "Valor deve ser preenchido e ser um numero positivo.")
		.refine((val) => !val.trim().startsWith("-"), {
			message: "O valor não pode ser negativo",
		})
		.refine((val) => !isNaN(parseFloat(val.replace(",", "."))), {
			message: "Valor inválido. Use ponto ou vírgula como separador decimal.",
		}),
	year: z.string().nonempty("O ano do carro é obrigatório."),
	kilometers: z.string().nonempty("A quantidade de km rodados é obrigatório."),
	city: z.string().nonempty("A cidade é obrigatória."),
	description: z.string().nonempty("A descrição é obrigatório."),
	whatsApp: z
		.string()
		.min(1, "O Whatsapp é obrigatorio")
		.refine((value) => /^(\d{10,11})$/.test(value), {
			message: "Numero de telofone invalido.",
		}),
});

export type DashFormData = z.infer<typeof dashSchema>;
