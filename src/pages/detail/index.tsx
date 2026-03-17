import { useNavigate, useParams } from "react-router";
import type { RouterParams } from "../../App";
import { useEffect, useState } from "react";
import type { ItemCarProps } from "../dashboard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import toast from "react-hot-toast";
import Container from "../../components/container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/swiper-bundle.css";
import ImageModal from "./components/imageModal";

export default function Detail() {
	const nav = useNavigate();
	const { id } = useParams<RouterParams["cardetail"]>();
	const [loading, setLoading] = useState<boolean>(true);
	const [loadImages, setLoadImages] = useState<string[]>([]);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
	const [car, setCar] = useState<ItemCarProps>();
	const [slidesPerView, setSlidesPerview] = useState<number>(1);
	useEffect(() => {
		handleSearchCar();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);
	async function handleSearchCar() {
		try {
			if (!id) {
				toast.error("Id não encontrado.");
				nav("/dashboard");
				return;
			}
			const docRef = doc(db, "collectionCars", id);
			const response = await getDoc(docRef);
			if (!response.exists()) {
				nav("/dashboard");
				return;
			}
			setSlidesPerview(response?.data().images.length === 1 ? 1 : 2.1);
			setCar(response.data() as ItemCarProps);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log(error.message);
		} finally {
			setLoading(false);
		}
	}
	function handleLoadImages(id: string) {
		setLoadImages((prev) => [...prev, id]);
	}
	function handleSendMsg() {
		const phone = car?.whatsApp?.replace(/\D/g, "");
		const message = `Olá, tenho interesse no ${car?.carName}`;
		if (!phone) {
			toast.error("Telefone inválido.");
			return;
		}
		window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
	}
	function handleModal(url: string) {
		setModalVisible(true);
		setModalImageUrl(url);
	}
	if (loading) {
		return (
			<div className="bg-gray-300 absolute flex min-h-screen w-screen top-0">
				<div className=" mx-auto my-auto flex items-center flex-col justify-center">
					<span className=" animate-bounce  text-2xl ">Carregando...</span>
					<div className="border-b-white border rounded-full size-16 animate-spin mt-5"></div>
				</div>
			</div>
		);
	}
	return (
		<Container>
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y]}
				slidesPerView={slidesPerView as number}
				spaceBetween={5}
				pagination={{ clickable: true }}
				scrollbar={{ draggable: true }}
				direction="horizontal"
				className="flex flex-row"
			>
				{car?.images.map((image, index) => (
					<SwiperSlide key={index} onClick={() => handleModal(image.url)}>
						<div
							className={`w-full h-72 flex justify-center items-center rounded-t-xl  bg-zinc-200 ${loadImages.includes(image.uid) ? "hidden" : "block"}`}
						>
							<div className="border-b-white border rounded-full size-16 animate-spin mt-5"></div>
						</div>
						<img
							className={`w-full  h-72  object-cover hover:cursor-pointer   transition duration-300 hover:scale-101 ${loadImages.includes(image.uid) ? "block" : "hidden"}`}
							src={image.url}
							onLoad={() => handleLoadImages(image.uid)}
							alt={`Imagem de um ${car?.carName}`}
						/>
					</SwiperSlide>
				))}
			</Swiper>
			<main className="bg-white px-4 py-6 w-full rounded-xl flex flex-col gap-1.5 mt-4 mb-5">
				<section className="flex flex-row items-center justify-between font-bold text-2xl py-1">
					<h1>{car?.carName}</h1>
					<span>R$ {car?.value}</span>
				</section>
				<p className="text-gray-700">{car?.model}</p>
				<section className="flex gap-4 mt-6">
					<div className="flex flex-col  gap-1">
						<span className="font-bold">Cidade</span>
						<span>{car?.city}</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="font-bold">Ano</span>
						<span>{car?.year}</span>
					</div>
				</section>
				<section className=" flex flex-col gap-2 mt-6">
					<span className="font-bold">Description</span>
					<p>{car?.description}</p>
				</section>
				<section className="flex flex-col  gap-1 mt-2">
					<span className="font-bold">Telefone</span>
					<p>{car?.whatsApp}</p>
				</section>
				<button
					type="button"
					onClick={handleSendMsg}
					className="bg-green-700 mt-6 rounded-2xl p-1.5 flex items-center justify-center text-white font-medium transition duration-300 cursor-pointer hover:bg-green-700/90"
				>
					Enviar mensagem whatsApp
				</button>
			</main>
			{modalVisible && modalImageUrl && (
				<ImageModal
					carName={car?.carName}
					imageUrl={modalImageUrl}
					setModalImageUrl={setModalImageUrl}
					setModalVisible={setModalVisible}
				/>
			)}
		</Container>
	);
}
