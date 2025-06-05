import { useState } from "react";
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

function UserBookList() {
    const [books, setBooks] = useState<BookInfo[]>([
        {
            volume_id: "harry-potter-1",
            title: "Harry Potter und der Stein der Weisen",
            authors: ["J.K. Rowling"],
            thumbnail: "https://bilder.buecher.de/produkte/56/56088/56088743z.jpg",
            isbn: "9783551551672",
            info_link: "https://www.carlsen.de/buch/harry-potter-und-der-stein-der-weisen/9783551551672",
            categories: ["Fantasy", "Kinderbuch"],
            language: "de"
        },
        {
            volume_id: "example456",
            title: "1984",
            authors: ["George Orwell"],
            thumbnail:
                "https://books.google.com/books/content?id=kotPYEqx7kMC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
            isbn: "9780451524935",
            info_link: "https://books.google.de/books?id=kotPYEqx7kMC",
            categories: ["Dystopie", "Politik", "Science Fiction"],
            language: "en"
        }
    ]);

    const removeBook = (volume_id: string) => {
        setBooks(prev => prev.filter(book => book.volume_id !== volume_id));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <div className="max-w-3xl mx-auto p-4">
                    <h1 className="text-2xl font-semibold mb-4">Deine Lieblingsbücher</h1>

                    <div className="h-[60vh] overflow-y-auto space-y-4">
                        {books.length === 0 ? (
                            <div className="text-center text-gray-500">Du hast noch keine Bücher gespeichert.</div>
                        ) : (
                            books.map((book) => (
                                <div
                                    key={book.volume_id}
                                    className="flex items-center gap-4 border rounded-lg p-4 shadow-sm"
                                >
                                    {book.thumbnail && (
                                        <img
                                            src={book.thumbnail}
                                            alt={`Cover von ${book.title}`}
                                            className="h-24 w-16 object-cover rounded"
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
                            ))
                        )}
                    </div>
                </div>
            </main>
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