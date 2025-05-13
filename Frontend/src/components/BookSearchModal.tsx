import { Plus, Search, X } from "lucide-react";

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
                className="w-11/12 rounded-xl bg-white p-5 pt-8 shadow-lg lg:w-1/2"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">
                        Füge neue Bücher hinzu!
                    </h2>
                    <button
                        className="btn btn-circle btn-ghost"
                        onClick={onClose}
                    >
                        <X />
                    </button>
                </div>

                <div className="join mb-5 flex">
                    <label className="input flex items-center">
                        <Search color="#6a7282" size={15} />
                        <input
                            type="search"
                            required
                            placeholder="Suche"
                            className="join-item ml-2"
                        />
                    </label>
                    <select className="select join-item w-1/5">
                        <option disabled selected>
                            Filter
                        </option>
                        <option>Neuste</option>
                        <option>Relevanteste</option>
                    </select>
                </div>

                <div className="max-h-[60vh] space-y-2 overflow-x-clip overflow-y-auto">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index}>
                            <div className="flex h-30">
                                <img
                                    src="https://m.media-amazon.com/images/I/419JCm3Tr+L._SY445_SX342_PQ57_.jpg"
                                    alt="Cover"
                                    width={80}
                                />
                                <div className="flex p-5 pb-0">
                                    <div className="">
                                        <a
                                            href="https://www.google.de/books/edition/Die_Tribute_von_Panem_X_Das_Lied_von_Vog/u-HkDwAAQBAJ?hl=de&gbpv=0" // Link zu Google Books
                                            className="mb-1 line-clamp-1 text-xl font-medium overflow-ellipsis hover:underline"
                                        >
                                            Tribute von Panem
                                        </a>
                                        <p className="mb-2"> Susanne Collins</p>

                                        <div className="justify-between space-x-2">
                                            <div className="badge badge-soft p-3">
                                                Fantasy
                                            </div>
                                            <div className="badge badge-soft p-3">
                                                Krimi
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1"></div>
                                <div className="flex items-center pr-5">
                                    <button className="btn btn-round items-">
                                        <Plus />
                                        <p className="hidden sm:block">
                                            Hinzufügen
                                        </p>
                                    </button>
                                </div>
                            </div>
                            <div className="divider"></div>
                        </div>
                    ))}
                    <div className="flex join justify-center">
                        <button className="join-item btn btn-ghost">«</button>
                        <button className="join-item btn btn-ghost">1</button>
                        <button className="join-item btn btn-ghost">»</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookSearchModal;
