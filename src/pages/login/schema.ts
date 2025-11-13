import z from "zod";

export const signInSchema = z.object({
	email: z.email("O email deve ser informado."),
	password: z.string().nonempty("A senha é obrigatoria."),
});

export const signUpSchema = z.object({
	name: z.string().nonempty("O nome é obrigatorio"),
	email: z.email("O email deve ser informado."),
	password: z.string().nonempty("A senha é obrigatoria."),
});

export type SignInData = z.infer<typeof signInSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
