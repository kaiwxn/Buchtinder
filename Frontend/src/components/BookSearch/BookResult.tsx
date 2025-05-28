import { Check, Plus } from "lucide-react";
import { BookJsonObject } from "./types";
import { useState } from "react";

const BACKUP_IMAGE_SRC =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSiaxXHKRBmNrpzuius2fLvoyrPjPWiu2jDg&s";

const USER_ID = "2"; 

type Props = {
    book: BookJsonObject;
    savedIds: string[];
    refreshSavedIds: () => void;
};

function BookResultItem({ book }: Props) {
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleAdd = async () => {
        setLoading(true);
        setIsSaved(true);
        try {
            await fetch("http://127.0.0.1:5000/books/add_book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: USER_ID, volume_id: book.volume_id }),
            });
            refreshSavedIds();
        } catch (error) {
            console.error("Fehler beim Hinzufügen:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        setLoading(true);
        setIsSaved(false);
        try {
            await fetch("http://127.0.0.1:5000/books/remove_book", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: USER_ID, volume_id: book.volume_id }),
            });
            refreshSavedIds();
        } catch (error) {
            console.error("Fehler beim Entfernen:", error);
        } finally {
            setLoading(false);
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

                        <div className="justify-between space-x-2">
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

                <div className="mr-5 flex items-center pr-5">
                    <button
                        className={`btn btn-round ${
                            isSaved ? "bg-green-500 text-white hover:bg-green-600" : ""
                        }`}
                        onClick={isSaved ? handleRemove : handleAdd}
                        disabled={loading}
                        title={isSaved ? "Als gelesen markieren" : "Zur Liste hinzufügen"}
                    >
                        {isSaved ? <Check /> : <Plus />}
                    </button>
                </div>
            </div>
            <div className="divider"></div>
        </>
    );
}

export default BookResultItem;


// import { Check, Plus } from "lucide-react";
// import { BookJsonObject } from "./types";
// import { useState } from "react";

// type Props = {
//     book: BookJsonObject;
// };

// const BACKUP_IMAGE_SRC =
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSiaxXHKRBmNrpzuius2fLvoyrPjPWiu2jDg&s";

// function BookResultItem({ book }: Props) {
//     const [isSelected, setIsSelected] = useState(false);

//     return (
//         <>
//             <div className="flex h-30">
//                 <img
//                     src={book.thumbnail || BACKUP_IMAGE_SRC}
//                     alt="Cover"
//                     width={80}
//                 />
//                 <div className="flex p-5 pb-0">
//                     <div>
//                         <a
//                             href={book.info_link}
//                             className="mb-1 line-clamp-1 text-xl font-medium overflow-ellipsis hover:underline"
//                         >
//                             {book.title}
//                         </a>
//                         <p className="mb-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap sm:max-w-[300px]">
//                             {book.authors?.slice(0, 3).join(", ")}
//                         </p>

//                         <div className="justify-between space-x-2">
//                             {book.categories?.map((category, index) => (
//                                 <div
//                                     key={index}
//                                     className="badge badge-soft max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap"
//                                 >
//                                     {category}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex-1"></div>
//                 {isSelected ? (
//                     <div className="mr-5 flex items-center pr-5">
//                         <button
//                             className="btn btn-round bg-green-500 text-white hover:bg-green-600"
//                             onClick={() => setIsSelected(false)}
//                         >
//                             <Check color="white" />
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="mr-5 flex items-center pr-5">
//                         <button
//                             className="btn btn-round"
//                             onClick={() => setIsSelected(true)}
//                         >
//                             <Plus />
//                         </button>
//                     </div>
//                 )}
//             </div>
//             <div className="divider"></div>
//         </>
//     );
// }

// export default BookResultItem;
