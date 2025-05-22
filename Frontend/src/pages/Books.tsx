import { useEffect, useState } from "react";
import { Check } from "lucide-react";

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

const USER_ID = "user123"; // 🔐 Ersetze durch echte User-ID bei Bedarf

function UserBookList() {
    const [books, setBooks] = useState<BookInfo[]>([]);
    const [loading, setLoading] = useState(true);

    // 📥 Holt die gespeicherten Bücher des Nutzers
    const fetchUserBooks = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://127.0.0.1:5000/books/get_books_from_user?user_id=${USER_ID}`);
            const data = await res.json();

            const volumeIds = data.map((b: any) => b.volume_id);

            const detailedBooks = await Promise.all(
                volumeIds.map((id: string) =>
                    fetch(`http://127.0.0.1:5000/books/fetch_book_info?volume_id=${id}`).then(res => res.json())
                )
            );

            setBooks(detailedBooks);
        } catch (err) {
            console.error("Fehler beim Laden der Bücher:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Entfernt ein Buch aus der Liste
    const removeBook = async (volume_id: string) => {
        try {
            await fetch("http://127.0.0.1:5000/books/remove_book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: USER_ID, volume_id }),
            });
            setBooks(prev => prev.filter(book => book.volume_id !== volume_id));
        } catch (err) {
            console.error("Fehler beim Entfernen des Buchs:", err);
        }
    };

    useEffect(() => {
        fetchUserBooks();
    }, []);

    if (loading) return <div className="text-center">📚 Lade Bücher...</div>;
    if (books.length === 0) return <div className="text-center">Du hast noch keine Bücher gespeichert.</div>;

    return (
        <div className="p-4 max-w-3xl mx-auto space-y-4">
            {books.map((book) => (
                <div
                    key={book.volume_id}
                    className="flex items-center gap-4 border rounded-lg p-4 shadow-sm"
                >
                    {book.thumbnail && (
                        <img
                            src={book.thumbnail}
                            alt="Cover"
                            className="h-20 w-14 object-cover rounded"
                        />
                    )}
                    <div className="flex-grow">
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.authors?.join(", ")}</p>
                        {book.categories?.length && (
                            <p className="text-xs italic text-gray-500">{book.categories.join(", ")}</p>
                        )}
                    </div>
                    <button
                        onClick={() => removeBook(book.volume_id)}
                        className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                        title="Als gelesen markieren"
                    >
                        <Check size={20} />
                    </button>
                </div>
            ))}
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