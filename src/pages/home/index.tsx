import { useContext, useEffect, useState } from "react";
import Container from "../../components/container";
import type { FirestoreCar, ItemCarProps } from "../dashboard";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/authContext";

export default function Home() {
	const [carList, setCarList] = useState<ItemCarProps[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadImages, setLoadImages] = useState<string[]>([]);
	const { user } = useContext(AuthContext)!;
	useEffect(() => {
		handleSearchCars();
	}, []);
	async function handleSearchCars() {
		try {
			const q = query(
				collection(db, "collectionCars"),
				orderBy("created", "desc")
			);
			const querySnapshot = await getDocs(q);
			if (querySnapshot.empty) {
				setCarList([]);
				return;
			}
			const cars: ItemCarProps[] = querySnapshot.docs.map((doc) => {
				const data = doc.data() as FirestoreCar;
				return {
					id: doc.id,
					...data,
				};
			});
			setCarList(cars);
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
			<section className=" flex items-center bg-white py-2 px-4 rounded-xl max-w-3xl mx-auto">
				<input
					type="text"
					placeholder="Digite o nome do carro..."
					className="flex border-gray-500 placeholder-gray-800  border flex-1 py-1.5 px-3 rounded-xl focus:outline-blue-400 outline-transparent"
				/>
				<button
					type="button"
					className="bg-red-500 transition duration-300 cursor-pointer hover:bg-red-600/95 text-white ml-1 px-5 flex  justify-center items-center rounded-xl py-1.5 max-w-36 w-full"
				>
					Buscar
				</button>
			</section>
			<h1 className="font-medium mt-6 mb-4 text-xl text-center">
				Carros novos e usados em todo o Brasil
			</h1>
			{carList.length !== 0 && (
				<main className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
					{carList.map((car) => (
						<Link to={`/cardetail/${car.id}`} key={car.id}>
							<section
								className="bg-white shadow-2xl rounded-xl flex flex-col"
								key={car.id}
							>
								<div
									className={`w-full h-56 object-cover flex justify-center items-center rounded-t-xl  bg-zinc-200 ${loadImages.includes(car.id) ? "hidden" : "block"}`}
								>
									<div className="border-b-white border rounded-full size-16 animate-spin mt-5"></div>
								</div>
								<img
									className={`w-full h-56 object-cover  rounded-t-xl transition duration-300 hover:scale-101 ${loadImages.includes(car.id) ? "block" : "hidden"}`}
									src={car.images[0].url}
									onLoad={() => handleLoadImages(car.id)}
									alt={`Imagem de um ${car.carName}`}
								/>
								<span className="font-bold px-2 py-2 text-lg">
									{car.carName}
								</span>
								<ul className="flex gap-6 px-2 pb-2">
									<li>Ano {car.year}</li>
									<li className="list-disc">{car.kilometers} km</li>
								</ul>
								<span className="text-xl px-2 pt-5 pb-1.5 font-bold">
									R$ {car.value}
								</span>
								<div className="border-b my-2 border-gray-400"></div>
								<span className="p-2 mb-2">{car.city}</span>
							</section>
						</Link>
					))}
				</main>
			)}
			{carList.length === 0 && (
				<div className="mt-6 flex flex-col items-center gap-2 justify-center">
					<h1 className="font-medium text-lg">Nenhum carro registrado</h1>
					{user?.uid ? (
						<Link
							to={"/dashboard/new"}
							className=" bg-white text-red-500 border border-red-500  rounded-xl  p-2 cursor-pointer transition duration-300 hover:bg-white/80"
						>
							Cadastrar novo carro
						</Link>
					) : (
						<Link
							to={"/login"}
							className=" bg-white text-blue-500 border border-blue-500  rounded-xl  p-2 cursor-pointer transition duration-300 hover:bg-white/80"
						>
							Faça login para cadastrar um carro
						</Link>
					)}
				</div>
			)}
		</Container>
	);
}
