import { Trash } from "lucide-react";
import Container from "../../components/container";
import SidebarDashboard from "./components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { db, storage } from "../../services/firebase";
import toast from "react-hot-toast";
import { deleteObject, ref } from "firebase/storage";
import { Link } from "react-router";

export interface ItemCarProps {
	id: string;
	carName: string;
	model: string;
	value: string;
	year: string;
	kilometers: string;
	city: string;
	description: string;
	whatsApp: string;
	owner_id: string;
	images: {
		uid: string;
		name: string;
		url: string;
	}[];
}

export type FirestoreCar = Omit<ItemCarProps, "id">;

export default function Dashboard() {
	const { user } = useContext(AuthContext)!;
	const [loading, setLoading] = useState<boolean>(true);
	const [carList, setCarList] = useState<ItemCarProps[]>([]);
	const [loadImages, setLoadImages] = useState<string[]>([]);
	useEffect(() => {
		handleSearchMyCars();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	async function handleSearchMyCars() {
		try {
			if (!user?.uid) {
				return;
			}
			const q = query(
				collection(db, "collectionCars"),
				where("owner_id", "==", user.uid)
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
	async function handleDeleteCar(car: ItemCarProps) {
		if (!car.id) {
			return;
		}
		try {
			const currentUser = user?.uid;
			const docRef = doc(db, "collectionCars", car.id);
			await Promise.all([
				deleteDoc(docRef),
				...car.images.map((img) => {
					return deleteObject(ref(storage, `images/${currentUser}/${img.uid}`));
				}),
			]);
			toast.success("Carro excluido com sucesso.");
			setCarList((prev) => prev.filter((item) => item.id !== car.id));
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log(error.message);
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
			<SidebarDashboard />
			{carList.length > 0 ? (
				<main className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4 mt-6">
					{carList.map((car) => (
						<Link to={`/cardetail/${car.id}`} key={car.id}>
							<section className="bg-white shadow-2xl rounded-xl flex flex-col relative">
								<button
									type="button"
									onClick={() => handleDeleteCar(car)}
									className="bg-white w-10 h-10 absolute top-2 right-2 flex justify-center items-center rounded-full z-20 hover:text-red-500 cursor-pointer transition duration-300 shadow hover:scale-102"
								>
									<Trash />
								</button>
								<div
									className={`w-full h-56 flex justify-center items-center rounded-t-xl  bg-zinc-200 ${loadImages.includes(car.id) ? "hidden" : "block"}`}
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
			) : (
				<div className="mt-6 flex flex-col items-center gap-2 justify-center">
					<h1 className="font-medium text-lg">Nenhum carro registrado</h1>
					<Link
						to={"/dashboard/new"}
						className=" bg-white text-red-500 border border-red-500  rounded-xl  p-2 cursor-pointer transition duration-300 hover:bg-white/80"
					>
						Cadastrar novo carro
					</Link>
				</div>
			)}
		</Container>
	);
}
