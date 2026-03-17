import { X } from "lucide-react";

interface ImageModalProps {
	imageUrl: string;
	carName: string | undefined;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setModalImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ImageModal({
	imageUrl,
	carName,
	setModalVisible,
	setModalImageUrl,
}: ImageModalProps) {
	function handleCloseModal() {
		setModalImageUrl(null);
		setModalVisible(false);
	}
	return (
		<div
			className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
			onClick={handleCloseModal}
		>
			<div
				className="relative flex flex-col items-end"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					onClick={handleCloseModal}
					className="bg-white text-black w-9 h-9 flex justify-center items-center rounded-full mb-2 cursor-pointer hover:bg-red-500 hover:text-white transition duration-300"
				>
					<X size={20} />
				</button>
				<img
					src={imageUrl}
					alt={`Imagem de um ${carName}`}
					className="max-h-[80vh] max-w-[90vw] min-h-96 object-contain rounded-lg"
				/>
			</div>
		</div>
	);
}
