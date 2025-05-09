import { Search, X } from "lucide-react";

type BookSearchModalProps = {
    onClose: () => void;
};

function BookSearchModal({ onClose }: BookSearchModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="w-11/12 rounded-xl bg-white p-5 pt-8 shadow-lg sm:w-1/2"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">
                        Füge neue Bücher hinzu!
                    </h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <label className="input mb-3">
                    <Search color="#6a7282" size={15} />
                    <input type="search" required placeholder="Suche" />
                </label>

                <div className="max-h-[60vh] space-y-2 overflow-y-auto">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <p key={i} className="rounded bg-gray-400 px-3 py-5">
                            Inhalt {i + 1}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BookSearchModal;
