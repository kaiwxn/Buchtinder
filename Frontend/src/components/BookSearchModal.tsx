import { Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

type BookSearchModalProps = {
    onClose: () => void;
};

type BookJsonObject = {
    volume_id: string;
    title: string;
    authors: string[];
    thumbnail?: string;
    isbn?: string;
    info_link: string;
    categories?: string[];
    language?: string;
};

function BookSearchModal({ onClose }: BookSearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<BookJsonObject[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    async function searchBooks(query: string, page: number = 0) {
        const response = await fetch(
            `http://127.0.0.1:5000/books/search_books?q=${encodeURIComponent(query)}&page=${page}`,
        );
        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }
        return await response.json();
    }

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const books = await searchBooks(query, page);
            setResults(books);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    useEffect(() => {
        fetchBooks();
        document
            .getElementById("book-results-list")
            ?.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    }, [page]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="h-[85vh] w-11/12 rounded-xl bg-white p-5 pt-8 shadow-lg lg:w-1/2"
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
                            placeholder="Suchbegriff eingeben..."
                            className="join-item ml-2"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    fetchBooks();
                                }
                            }}
                        />
                    </label>

                    <select className="select join-item w-fit">
                        <option disabled selected>
                            Filter
                        </option>
                        <option>Neuste</option>
                        <option>Relevanteste</option>
                    </select>
                    <button
                        className="btn btn-neutral join-item shadow-none"
                        onClick={() => {
                            setPage(0);
                            fetchBooks();
                        }}
                    >
                        Suchen
                    </button>
                </div>
                {loading && (
                    <div className="flex items-center justify-center">
                        <span className="loading loading-spinner loading-xl"></span>
                    </div>
                )}
                <div
                    id="book-results-list"
                    className="max-h-[60vh] space-y-2 overflow-x-clip overflow-y-auto"
                >
                    {results.map((book, index) => (
                        <div key={index}>
                            <div className="flex h-30">
                                <img
                                    src={
                                        book.thumbnail ||
                                        "https://thumbs.dreamstime.com/b/transparent-seamless-pattern-background-checkered-simulation-alpha-channel-png-wallpaper-empty-gird-grid-vector-illustration-308566526.jpg"
                                    }
                                    alt="Cover"
                                    width={80}
                                />
                                <div className="flex p-5 pb-0">
                                    <div className="">
                                        <a
                                            href={book.info_link}
                                            className="mb-1 line-clamp-1 text-xl font-medium overflow-ellipsis hover:underline"
                                        >
                                            {book.title}
                                        </a>
                                        <p className="mb-2 sm:max-w-[300px] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            {book.authors
                                                ?.slice(0, 3)
                                                .join(
                                                    ", ",
                                                ) // First 3 authors
                                            }
                                        </p>

                                        <div className="justify-between space-x-2">
                                            {book.categories?.map(
                                                (
                                                    category: string,
                                                    index: number,
                                                ) => (
                                                    <div
                                                        key={index}
                                                        className="badge badge-soft max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap"
                                                    >
                                                        {category}
                                                    </div>
                                                ),
                                            )}
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
                    <div className="join flex justify-center">
                        <button
                            className="join-item btn btn-ghost"
                            onClick={handlePreviousPage}
                            disabled={page === 0}
                        >
                            «
                        </button>
                        <button className="join-item btn btn-ghost">
                            {page}
                        </button>
                        <button
                            className="join-item btn btn-ghost"
                            onClick={handleNextPage}
                            disabled={results.length === 0}
                        >
                            »
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookSearchModal;
