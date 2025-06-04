import { Check, Plus } from "lucide-react";
import { BookJsonObject } from "./types";
import { useState } from "react";
import { USER_ID } from "../../pages/Login/Login";

type Props = {
    book: BookJsonObject;
};

const BACKUP_IMAGE_SRC =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSiaxXHKRBmNrpzuius2fLvoyrPjPWiu2jDg&s";

function BookResultItem({ book }: Props) {
    const [isSaved, setIsSaved] = useState(false);

    const handleAdd = async () => {
        setIsSaved(true);
        try {
            await fetch("http://127.0.0.1:5000/books/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: USER_ID,
                    volume_id: book.volume_id,
                }),
            });
        } catch (error) {
            console.error("Fehler beim Hinzufügen:", error);
        }
    };

    const handleRemove = async () => {
        setIsSaved(false);
        try {
            await fetch("http://127.0.0.1:5000/books/remove", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: USER_ID,
                    volume_id: book.volume_id,
                }),
            });
        } catch (error) {
            console.error("Fehler beim Entfernen:", error);
        }
    };

    return (
        <>
            <div className="flex h-30">
                <img
                    src={book.thumbnail || BACKUP_IMAGE_SRC}
                    alt="Cover"
                    width={80}
                />
                <div className="flex p-5 pb-0">
                    <div>
                        <a
                            href={book.info_link}
                            className="mb-1 line-clamp-1 text-xl font-medium overflow-ellipsis hover:underline"
                        >
                            {book.title}
                        </a>
                        <p className="mb-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap sm:max-w-[300px]">
                            {book.authors?.slice(0, 3).join(", ")}
                        </p>

                        <div className="overflow max-w-[80%] justify-between space-x-2 whitespace-nowrap">
                            {book.categories?.map((category, index) => (
                                <div
                                    key={index}
                                    className="badge badge-soft max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap"
                                >
                                    {category}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex-1"></div>
                {isSaved ? (
                    <div className="mr-5 flex items-center pr-5">
                        <button
                            className="btn btn-round bg-green-500 text-white hover:bg-green-600"
                            onClick={handleRemove}
                        >
                            <Check color="white" />
                        </button>
                    </div>
                ) : (
                    <div className="mr-5 flex items-center pr-5">
                        <button className="btn btn-round" onClick={handleAdd}>
                            <Plus />
                        </button>
                    </div>
                )}
            </div>
            <div className="divider"></div>
        </>
    );
}

export default BookResultItem;
