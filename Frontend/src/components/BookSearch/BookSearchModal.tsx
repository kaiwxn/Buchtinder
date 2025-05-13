import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { BookJsonObject, BookSearchModalProps } from "./types";
import BookResultItem from "./BookResult";
import BookSearchbar from "./BookSearchbar";
import PageChanger from "./PageChanger";

function BookSearchModal({ onClose }: BookSearchModalProps) {
    const [query, setQuery] = useState(""); // Input value for the search bar
    const [lastQuery, setLastQuery] = useState(""); // Last search query
    const [results, setResults] = useState<BookJsonObject[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchBooks = async (q: string, pageNumber: number) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/books/search_books?q=${encodeURIComponent(q)}&page=${pageNumber}`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch books");
            }
            const books = await response.json();
            setResults(books);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        document
            .getElementById("book-results-list")
            ?.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        scrollToTop();
        fetchBooks(lastQuery, page);
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
                <BookSearchbar
                    query={query}
                    setLastQuery={setLastQuery}
                    setQuery={setQuery}
                    setPage={setPage}
                    fetchBooks={fetchBooks}
                    scrollToTop={scrollToTop}
                />
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
                        <BookResultItem key={index} book={book} />
                    ))}
                    <PageChanger
                        page={page}
                        setPage={setPage}
                        results={results}
                    />
                </div>
            </div>
        </div>
    );
}

export default BookSearchModal;
