import { Plus } from "lucide-react";
import { BookJsonObject } from "./types";

type Props = {
    book: BookJsonObject;
};

export default function BookResultItem({ book }: Props) {
    return (
        <>
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
                <div className="flex items-center pr-5">
                    <button className="btn btn-round">
                        <Plus />
                        <p className="hidden sm:block">Hinzufügen</p>
                    </button>
                </div>
            </div>
            <div className="divider"></div>
        </>
    );
}
