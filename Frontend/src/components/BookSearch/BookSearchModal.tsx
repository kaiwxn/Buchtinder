import { AArrowUp, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BookJsonObject, BookSearchModalProps } from "./types";
import BookResultItem from "./BookResult";
import BookSearchbar from "./BookSearchbar";
import PageChanger from "./PageChanger";
import { USER_ID } from "../../pages/Login/Login";

function BookSearchModal({ onClose }: BookSearchModalProps) {
    const [query, setQuery] = useState(""); // Input value for the search bar
    const [lastQuery, setLastQuery] = useState(""); // Last search query
    const [order, setOrder] = useState("relevance"); // Order of search results

    const [results, setResults] = useState<BookJsonObject[]>([]);
    const [savedBooks, setSavedBooks] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchBooks = async (q: string, pageNumber: number) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/books/search?q=${encodeURIComponent(q)}&page=${pageNumber}&userID=${USER_ID}&orderBy=${order}`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch books");
            }
            const books = await response.json();
            const saved: Set<string> = new Set(
                (books as BookJsonObject[])
                    .filter((b: BookJsonObject) => b.isSaved)
                    .map((b: BookJsonObject) => b.volume_id),
            );
            setResults(books);
            setSavedBooks(saved);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (volume_id: string) => {
        setSavedBooks((prev) => new Set(prev).add(volume_id));
        try {
            await fetch("http://127.0.0.1:5000/books/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: USER_ID,
                    volume_id: volume_id,
                }),
            });
        } catch (error) {
            console.error("Fehler beim Hinzufügen:", error);
        }
    };

    const handleRemove = async (volume_id: string) => {
        setSavedBooks((prev) => {
            const newSet = new Set(prev);
            newSet.delete(volume_id);
            return newSet;
        });
        try {
            await fetch("http://127.0.0.1:5000/books/remove", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: USER_ID,
                    volume_id: volume_id,
                }),
            });
        } catch (error) {
            console.error("Fehler beim Entfernen:", error);
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
    }, [lastQuery, page, order]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLastQuery(query);
            setPage(0);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
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
                    setQuery={setQuery}
                    order={order}
                    setOrder={setOrder}
                    onManualSearch={() => {
                        setPage(0);
                        setLastQuery(query);
                    }}
                />
                {loading && (
                    <div className="flex items-center justify-center">
                        <span className="loading loading-spinner loading-xl"></span>
                    </div>
                )}
                {query.length === 0 && (
                    <div className="flex items-center justify-center">
                        {/* Hier könnte ein Platzhalter für leere Suchergebnisse sein */}
                    </div>
                )}
                <div
                    id="book-results-list"
                    className="max-h-[60vh] space-y-2 overflow-x-clip overflow-y-auto"
                >
                    {results.map((book, index) => (
                        <BookResultItem
                            key={index}
                            book={book}
                            isSaved={savedBooks.has(book.volume_id)}
                            handleAdd={handleAdd}
                            handleRemove={handleRemove}
                        />
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
