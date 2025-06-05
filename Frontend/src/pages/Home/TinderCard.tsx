import { Heart, Tag, X } from "lucide-react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { USER_ID } from "../Login/Login";
import { CardData } from "./types";

type CardProps = CardData & {
    id: number;
    setCards: (cards: any) => void;
    cardNumber: number;
};

function Card({
    id,
    friend_id,
    friend_name,
    imgSrc,
    favoriteCategories,
    bookSrcs,
    setCards,
    cardNumber,
}: CardProps) {
    const cardX = useMotionValue(0);
    const rotateRaw = useTransform(cardX, [-150, 150], [-18, 18]);
    const opacity = useTransform(cardX, [-150, 0, 150], [0, 1, 0]);

    const scrollRefTop = useRef<HTMLDivElement | null>(null);
    const scrollRefBottom = useRef<HTMLDivElement | null>(null);
    const isFront = id === cardNumber - 1;

    const rotate = useTransform(() => {
        return `${rotateRaw.get()}deg`;
    });

    const handleDragEnd = () => {
        if (Math.abs(cardX.get()) > 100) {
            setCards((prev: any) => prev.filter((v: any) => v.id !== id));
        }
    };
    const handleButtonRemove = async (direction: "left" | "right") => {
        const to = direction === "left" ? -200 : 200; // Swipe simulieren
        await animate(cardX, to, { duration: 0.3 });
        setCards((prev: any) => prev.filter((v: any) => v.id !== id));
    };

    const addFriend = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/friends/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: USER_ID,
                    friend_id: id,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to add friend");
            }
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };

    useEffect(() => {
        if (!isFront) return;

        const scrollElements = [scrollRefTop.current, scrollRefBottom.current];
        const intervals: number[] = [];

        scrollElements.forEach((el) => {
            if (!el) return;

            let direction = 1;
            const step = 1;
            const speed = 15;

            const intervalId = window.setInterval(() => {
                const maxScrollLeft = el.scrollWidth - el.clientWidth;

                el.scrollLeft += direction * step;

                if (el.scrollLeft >= maxScrollLeft) direction = -1;
                else if (el.scrollLeft <= 0) direction = 1;
            }, speed);

            intervals.push(intervalId);
        });

        return () => {
            intervals.forEach(window.clearInterval);
        };
    }, [isFront]);

    const renderImages = (srcs: string[]) =>
        Array.from({ length: srcs.length }).map((_, idx) => (
            <img
                key={idx}
                src={srcs[idx]}
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
                boxShadow: isFront
                    ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
                    : undefined,
                transition: "0.125s transform",
            }}
            animate={{
                scale: isFront ? 1 : 0.99,
            }}
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
        >
            <div className="pointer-events-none top-0 mt-8 flex justify-around">
                <div
                    ref={scrollRefTop}
                    className="scrollbar-hide flex h-full w-full items-center space-x-6 overflow-x-auto px-6"
                    style={{ scrollbarWidth: "none" }}
                >
                    {renderImages(bookSrcs)}
                </div>
            </div>
            <div className="pointer-events-none top-0 mt-8 flex justify-around">
                <div
                    ref={scrollRefBottom}
                    className="scrollbar-hide flex h-full w-full items-center space-x-6 overflow-x-auto px-6"
                    style={{ scrollbarWidth: "none" }}
                >
                    <div className="w-10"></div>
                    {renderImages(bookSrcs)}
                </div>
            </div>
            <div className="absolute bottom-0 h-1/3 w-full rounded-b-lg p-4 text-white">
                <div className="mx-5 mb-10 flex h-15 w-full items-center space-x-5">
                    <img
                        alt="User avatar"
                        src={imgSrc}
                        className="max-h-15 rounded-full"
                    />
                    <div className="flex w-full flex-col justify-between">
                        <p className="text-3xl font-semibold">{friend_name}</p>
                        <div className="flex items-center space-x-2">
                            <Tag size={15} />
                            <p className="text-l">
                                {favoriteCategories.join(", ")}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-between">
                    <button
                        className="btn btn-ghost ml-3 space-x-1 px-5 py-6 hover:scale-105"
                        onClick={() => handleButtonRemove("left")}
                    >
                        <X size={30} />
                        <p className="text-3xl font-semibold">Next</p>
                    </button>

                    <button
                        className="btn btn-ghost mr-3 space-x-1 px-5 py-6 hover:scale-105"
                        onClick={() => handleButtonRemove("right")}
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
