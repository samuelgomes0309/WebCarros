import { useContext, useEffect, useState } from "react";
import Container from "../../../components/container";
import Input from "../components/inputForm";
import SidebarDashboard from "../components/sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dashSchema, type DashFormData } from "./schema";
import { Trash, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../contexts/authContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../services/firebase";
import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";

interface PicturesProps {
	uid: string;
	name: string;
	previewUrl: string;
	url: string | null;
	file: File;
}

interface CarProps {
	carName: string;
	model: string;
	value: string;
	year: string;
	kilometers: string;
	city: string;
	description: string;
	whatsApp: string;
	owner_id: string;
	created: Date;
	images: {
		uid: string;
		name: string;
		url: string;
	}[];
}

export default function NewDash() {
	const { user } = useContext(AuthContext)!;
	const [focus, setFocus] = useState<string | null>(null);
	const [pictures, setPictures] = useState<PicturesProps[]>([]);
	const [pictureError, setPictureError] = useState<boolean>(false);
	const {
		reset,
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<DashFormData>({ resolver: zodResolver(dashSchema) });
	useEffect(() => {
		reset();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	async function handleUpload(image: File) {
		if (!user?.uid) return;
		const currentUser = user.uid;
		const uidImage = v4();
		const storageRef = ref(storage, `images/${currentUser}/${uidImage}`);
		await uploadBytes(storageRef, image);
		const downloadUrl = await getDownloadURL(storageRef);
		return {
			uid: uidImage,
			name: image.name,
			url: downloadUrl,
		};
	}
	function handlePictures(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files || !files.length) return;
		if (pictures.length >= 7) {
			toast.error(
				"Você atingiu o limite de 7 imagens. Apague alguma para adicionar outra."
			);
			return;
		}
		const image = files[0];
		if (!image.type.startsWith("image/")) {
			toast.error("Formato inválido. Apenas imagens são permitidas.");
			return;
		}
		// Validação de tamanho 5mb
		const maxSizeMB = 5;
		if (image.size > maxSizeMB * 1024 * 1024) {
			toast.error(`Imagem muito grande. Máximo permitido: ${maxSizeMB}MB.`);
			return;
		}
		const uidImage = v4();
		const imgObj = {
			uid: uidImage,
			previewUrl: URL.createObjectURL(image),
			name: image.name,
			url: null,
			file: image,
		};
		setPictures((prev) => [...prev, imgObj]);
		setPictureError(false);
	}
	async function onSubmit(data: DashFormData) {
		if (pictures.length < 1) {
			toast.error("Necessario anexar alguma imagem.");
			setPictureError(true);
			return;
		}
		try {
			const uploadedImagesRaw = await Promise.all(
				pictures.map((pic) => handleUpload(pic.file))
			);
			// remover undefined
			const uploadedImages = uploadedImagesRaw.filter(
				(img): img is { uid: string; name: string; url: string } => Boolean(img)
			);
			if (!user?.uid || uploadedImages.length === 0) {
				toast.error("Erro ao enviar imagens.");
				return;
			}
			const docData: CarProps = {
				owner_id: user?.uid,
				images: uploadedImages,
				created: new Date(),
				...data,
			};
			const ref = collection(db, "collectionCars");
			await addDoc(ref, docData);
			reset();
			setPictures([]);
			toast.success("Cadastrado com sucesso!");
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(error.message);
		}
	}
	function handleDeleteImage(index: number) {
		setPictures((prev) =>
			prev.filter((_item, index_item) => index_item !== index)
		);
	}
	return (
		<Container>
			<SidebarDashboard />
			<div className="bg-white w-full flex flex-col sm:flex-row items-center gap-2 my-4 px-6 py-3 rounded-xl shadow">
				<button
					className={`${pictureError && "border-red-500 border-2"} cursor-pointer h-32 border relative border-gray-400 w-48  flex justify-center items-center rounded-md`}
				>
					<div className="absolute cursor-pointer transition duration-300 hover:scale-102">
						<Upload size={30} color={pictureError ? "#f00" : "#000"} />
					</div>
					<div className="cursor-pointer  w-full  h-full">
						<input
							type="file"
							accept="image/*"
							onChange={(e) => handlePictures(e)}
							className="opacity-0 cursor-pointer w-full h-full"
						/>
					</div>
				</button>
				<span className="font-semibold text-red-500 py-0.5">
					{pictureError && "Adicione alguma imagem."}
				</span>
				<div className="flex w-full flex-wrap gap-3">
					{pictures.length > 0 &&
						pictures.map((image, index) => (
							<div
								className="flex justify-center items-center rounded-xl shadow"
								key={image.uid}
							>
								<img
									className="h-32 w-48 object-cover rounded-xl"
									key={image.uid}
									src={image.previewUrl}
								/>
								<button
									type="button"
									className="absolute text-black cursor-pointer transition duration-300 hover:scale-105 z-20 hover:text-blue-700  "
									onClick={() => handleDeleteImage(index)}
								>
									<Trash />
								</button>
							</div>
						))}
				</div>
			</div>
			<section className="bg-white flex flex-col rounded-xl shadow p-6 mb-10">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full flex flex-col"
				>
					<Input
						placeholder="Ex: BMW"
						type="text"
						errors={errors.carName?.message}
						focus={focus}
						name="carName"
						register={register}
						setFocus={setFocus}
						label="Nome do carro"
					/>
					<Input
						placeholder="Ex: 320I"
						type="text"
						errors={errors.model?.message}
						focus={focus}
						name="model"
						register={register}
						setFocus={setFocus}
						label="Modelo do carro"
					/>
					<div className="flex flex-col sm:flex-row  gap-2 max-w-4/5 w-full">
						<div className="flex-1 flex flex-col">
							<Input
								placeholder="Ex: 2017/2018"
								type="text"
								errors={errors.year?.message}
								focus={focus}
								name="year"
								register={register}
								setFocus={setFocus}
								label="Ano do carro"
							/>
						</div>
						<div className="flex-1 flex flex-col">
							<Input
								placeholder="Ex: 7900"
								type="text"
								errors={errors.kilometers?.message}
								focus={focus}
								name="kilometers"
								register={register}
								setFocus={setFocus}
								label="Km rodados"
							/>
						</div>
					</div>
					<Input
						placeholder="Ex: 210.000"
						type="text"
						errors={errors.value?.message}
						focus={focus}
						name="value"
						register={register}
						setFocus={setFocus}
						label="Valor do carro"
					/>
					<Input
						placeholder="Ex: Belo Horizonte - MG"
						type="text"
						errors={errors.city?.message}
						focus={focus}
						name="city"
						register={register}
						setFocus={setFocus}
						label="Cidade"
					/>
					<div className="flex flex-col sm:flex-row  gap-2 max-w-4/5 w-full">
						<div className="flex flex-1">
							<Input
								placeholder="Ex: 03499820842"
								type="text"
								errors={errors.whatsApp?.message}
								focus={focus}
								name="whatsApp"
								register={register}
								setFocus={setFocus}
								label="Whatsapp"
							/>
						</div>
						<div className="flex-1 flex w-full"></div>
					</div>
					<label className="py-2 font-medium text-black">Descrição</label>
					<textarea
						className={`px-4 py-2 border  w-full resize-none h-32  border-gray-400 rounded-xl placeholder-gray-800  ${!errors.description?.message && focus === "description" ? "outline outline-blue-400" : "outline-0"}   ${errors.description?.message && "outline-1 outline-red-500"}`}
						placeholder="Ex: Bmw de procedencia, unico dono..."
						{...register("description")}
						onBlur={() => setFocus(null)}
						onFocus={() => setFocus("description")}
						id="description"
					/>
					{errors?.description && (
						<span className="font-semibold text-red-500 py-0.5">
							{errors?.description.message}
						</span>
					)}
					<button
						disabled={isSubmitting}
						className={`w-full cursor-pointer mt-5 transition duration-300 hover:bg-zinc-800/95 bg-zinc-900 rounded-xl py-1.5 text-white font-bold disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-black`}
					>
						{isSubmitting ? (
							<span className="animate-pulse"> Cadastrando...</span>
						) : (
							"Cadastrar"
						)}
					</button>
				</form>
			</section>
		</Container>
	);
}
