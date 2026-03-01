// A simple reusable modal wrapper
export default function Modal({ title, onClose, children }) {
	return (
		// Dark backdrop
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
					<h2 className="text-lg font-semibold text-slate-800">{title}</h2>
					<button
						onClick={onClose}
						className="text-slate-400 hover:text-slate-700 text-xl font-light leading-none"
					>
						×
					</button>
				</div>
				{/* Body */}
				<div className="px-6 py-5">{children}</div>
			</div>
		</div>
	);
}
