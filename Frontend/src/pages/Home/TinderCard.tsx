import { Heart, Tag, X } from "lucide-react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { CardData } from "./types";

type CardProps = CardData & {
    setCards: (cards: any) => void;
    cards: CardData[];
};

const BACKUP_IMAGE_SRC =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSiaxXHKRBmNrpzuius2fLvoyrPjPWiu2jDg&s";

const BACKUP_PROFILE_IMAGE_SRC =
    "https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg";

function Card({
    user_id,
    username,
    profileImage,
    top_categories,
    thumbnails,
    setCards,
    cards,
}: CardProps) {
    // Zustand für die Kartenposition
    const cardX = useMotionValue(0);

    // Falls die Karte gezogen wird, wird die Opazität und Rotation angepasst
    const rotateRaw = useTransform(cardX, [-150, 150], [-18, 18]);
    const opacity = useTransform(cardX, [-150, 0, 150], [0, 1, 0]);
    const rotate = useTransform(() => {
        return `${rotateRaw.get()}deg`;
    });

    // Zustand für das automatischen scrolling beider Buchanzeigen
    const scrollRefTop = useRef<HTMLDivElement | null>(null);
    const scrollRefBottom = useRef<HTMLDivElement | null>(null);

    // Nur mit der obersten Karte wird interagiert
    const onTop = user_id === cards[cards.length - 1]?.user_id;

    const addFriend = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/friends/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: sessionStorage.getItem("token"),
                    friend_id: user_id,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to add friend");
            }
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };

    const handleDragEnd = async () => {
        if (Math.abs(cardX.get()) <= 100) {
            return;
        }
        if (cardX.get() > 0) {
            await addFriend();
        }
        setCards((prev: any) => prev.filter((v: any) => v.user_id !== user_id));
    };

    const handleButtonSwipe = async (direction: "left" | "right") => {
        const newX = direction === "left" ? -200 : 200; // Swipe simulieren
        if (direction === "right") {
            addFriend();
        }
        await animate(cardX, newX, {
            duration: 0.3,
        });
        setCards((prev: any) => prev.filter((v: any) => v.user_id !== user_id));
    };

    useEffect(() => {
        if (!onTop) return;

        const setupScroll = (el: HTMLDivElement | null) => {
            if (!el) return;

            let direction = 1;
            const step = 1;
            const speed = 15; // Update in milliseconds

            const scroll = () => {
                const maxScrollLeft = el.scrollWidth - el.clientWidth - 10; // 10px for padding
                el.scrollLeft += direction * step;

                if (el.scrollLeft >= maxScrollLeft) direction = -1;
                else if (el.scrollLeft <= 0) direction = 1;
            };

            const intervalId = setInterval(scroll, speed);
            return () => clearInterval(intervalId);
        };

        const cleanups = [
            setupScroll(scrollRefTop.current),
            setupScroll(scrollRefBottom.current),
        ].filter(Boolean); // remove undefined

        return () => {
            cleanups.forEach((cleanup) => cleanup?.());
        };
    }, [onTop]);

    const renderImages = (srcs: string[]) =>
        Array.from({ length: srcs.length }).map((_, idx) => (
            <img
                key={idx}
                src={srcs[idx] || BACKUP_IMAGE_SRC}
                alt={`Book Cover ${idx + 1}`}
                className="h-32 w-24 rounded object-cover shadow-md"
            />
        ));

    return (
        <motion.div
            className="absolute h-130 w-110 origin-bottom rounded-lg bg-gradient-to-b from-white to-black hover:cursor-grab active:cursor-grabbing"
            style={{
                x: cardX,
                backgroundColor: "gray",
                backgroundSize: "cover",
                backgroundPosition: "center",
                rotate,
                opacity,
                boxShadow: onTop
                    ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
                    : undefined,
                transition: "0.125s transform",
            }}
            animate={{
                scale: onTop ? 1 : 0.99,
            }}
            drag={onTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
        >
            <div className="pointer-events-none top-0 mt-8 flex justify-around">
                <div
                    ref={scrollRefTop}
                    className="scrollbar-hide flex h-full w-full items-center space-x-6 overflow-x-auto px-10"
                    style={{ scrollbarWidth: "none" }}
                >
                    {renderImages(
                        thumbnails.slice(0, Math.ceil(thumbnails.length / 2)),
                    )}
                </div>
            </div>
            <div className="pointer-events-none top-0 mt-8 flex justify-around">
                <div
                    ref={scrollRefBottom}
                    className="scrollbar-hide flex h-full w-full items-center space-x-6 overflow-x-auto px-10"
                    style={{ scrollbarWidth: "none" }}
                >
                    {renderImages(
                        thumbnails.slice(
                            Math.floor(thumbnails.length / 2),
                            thumbnails.length,
                        ),
                    )}
                </div>
            </div>
            <div className="absolute bottom-0 h-1/3 w-full rounded-b-lg p-4 text-white">
                <div className="mx-5 mb-7 flex h-15 w-full items-center space-x-5">
                    <img
                        alt="User avatar"
                        src={profileImage || BACKUP_PROFILE_IMAGE_SRC}
                        className="max-h-15 rounded-full"
                    />
                    <div className="flex max-w-3/4 flex-col justify-between">
                        <p className="overflow-hidden text-3xl font-semibold overflow-ellipsis">
                            {username}
                        </p>
                        <div className="flex items-center space-x-2">
                            <Tag size={15} />
                            <p className="text-l overflow-hidden overflow-ellipsis whitespace-nowrap">
                                {top_categories.join(", ")}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-between">
                    <button
                        className="btn btn-ghost ml-3 space-x-1 px-5 py-6 hover:scale-105"
                        onClick={() => handleButtonSwipe("left")}
                    >
                        <X size={30} />
                        <p className="text-3xl font-semibold">Next</p>
                    </button>

                    <button
                        className="btn btn-ghost mr-3 space-x-1 px-5 py-6 hover:scale-105"
                        onClick={() => handleButtonSwipe("right")}
                    >
                        <Heart size={30} />
                        <p className="text-3xl font-semibold">Like</p>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default Card;
