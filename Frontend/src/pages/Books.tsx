import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { USER_ID } from "./Login/Login";

type BookInfo = {
    volume_id: string;
    title: string;
    authors: string[];
    thumbnail?: string;
    isbn?: string;
    info_link?: string;
    categories?: string[];
    language?: string;
};

function UserBookList() {
    const [books, setBooks] = useState<BookInfo[]>([]);

    const fetchBooks = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/books/get_books_from_user?user_id=${USER_ID}`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch books");
            }
            const books = await response.json();
            setBooks(books);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
        }
    };

    const removeBook = async (volume_id: string) => {
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
        setBooks((prev) => prev.filter((book) => book.volume_id !== volume_id));
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div className="mt-10 min-h-screen px-4 sm:px-10 lg:px-60">
            <h1 className="mb-10 text-4xl">Deine Lieblingsbücher</h1>

            <div className="h-[60vh] items-center justify-center space-y-4 overflow-y-auto">
                {books.length === 0 ? (
                    <div className="text-center text-gray-500">
                        Du hast noch keine Bücher gespeichert.
                    </div>
                ) : (
                    books.map((book) => (
                        <div
                            key={book.volume_id}
                            className="flex max-w-3/4 items-center gap-4 rounded-lg border p-4 shadow-sm"
                        >
                            {book.thumbnail && (
                                <img
                                    src={book.thumbnail}
                                    alt={`Cover von ${book.title}`}
                                    className="h-24 w-16 rounded object-cover"
                                />
                            )}
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold">
                                    {book.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {book.authors?.join(", ")}
                                </p>
                                {book.categories?.length && (
                                    <p className="text-xs text-gray-500 italic">
                                        {book.categories.join(", ")}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => removeBook(book.volume_id)}
                                className="rounded-full bg-green-500 p-2 text-white hover:bg-green-600"
                                title="Als gelesen markieren"
                            >
                                <Check size={20} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default UserBookList;

// function Books(){
//     return (
//         <div className="px-4 sm:px-10 lg:px-60 justify-center min-h-screen mt-10">
//             <h1 className="text-4xl">Books Page</h1>
//             <p>Welcome to the Books page! </p>
//         </div>
//     );
// }

// export default Books;
