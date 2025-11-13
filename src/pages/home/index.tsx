import Container from "../../components/container";

export default function Home() {
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
			<main className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
				<section className="bg-white shadow-2xl rounded-xl flex flex-col">
					<img
						className="w-full h-56 object-cover  rounded-t-xl transition duration-300 hover:scale-101"
						src="https://nxboats.com.br/wp-content/uploads/2023/11/marcas-de-carros-de-luxo-lamborghini.jpg"
						alt="Imagem de um carro"
					/>
					<span className="font-bold px-2 py-2 text-lg">Nome do carro</span>
					<ul className="flex gap-6 px-2 pb-2">
						<li>2016/2017</li>
						<li className="list-disc">2066 km</li>
					</ul>
					<span className="text-xl px-2 pt-5 pb-1.5 font-bold">R$ 299900</span>
					<div className="border-b my-2 border-gray-400"></div>
					<span className="p-2 mb-2">Sao paulo - SP</span>
				</section>
			</main>
		</Container>
	);
}
