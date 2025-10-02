import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function ImageModal({ src, alt, onClose }) {
	// ...small component, minimal dependencies...
	useEffect(() => {
		function onKey(e) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	if (!src) return null;

	return (
		<motion.div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}
		>
			<motion.div
				className="max-w-[95%] max-h-[95%] bg-transparent rounded-lg p-2"
				initial={{ scale: 0.95 }}
				animate={{ scale: 1 }}
				exit={{ scale: 0.95 }}
				onClick={(e) => e.stopPropagation()}
			>
				<img
					src={src}
					alt={alt || "Image"}
					className="w-full h-full object-contain rounded-md"
				/>
			</motion.div>
		</motion.div>
	);
}
