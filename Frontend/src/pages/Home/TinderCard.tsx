import { Heart, Tag, X } from "lucide-react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";

type CardProps = {
    id: number;
    setCards: (cards: any) => void;
    cards: { id: number; text: string }[];
};

function Card({ id, setCards, cards }: CardProps) {
    const x = useMotionValue(0);
    const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
    const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

    const isFront = id === cards[cards.length - 1]?.id;

    const rotate = useTransform(() => {
        return `${rotateRaw.get()}deg`;
    });

    const handleDragEnd = () => {
        if (Math.abs(x.get()) > 100) {
            setCards((prev: any) => prev.filter((v: any) => v.id !== id));
        }
    };
    const swipeAndRemove = async (direction: "left" | "right") => {
        const to = direction === "left" ? -200 : 200; // Swipe simulieren
        await animate(x, to, { duration: 0.3 });
        setCards((prev: any) => prev.filter((v: any) => v.id !== id));
    };

    return (
        <motion.div
            className="absolute flex h-130 w-110 origin-bottom rounded-lg bg-gradient-to-b from-white to-black hover:cursor-grab active:cursor-grabbing"
            style={{
                x,
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
            <div className="absolute bottom-0 h-1/3 w-full rounded-b-lg p-4 text-white">
                <div className="mx-5 mb-10 flex h-15 w-full items-center space-x-5">
                    <img
                        alt="User avatar"
                        src="https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                        className="max-h-15 rounded-full"
                    />
                    <div className="flex w-full flex-col justify-between">
                        <p className="text-3xl font-semibold">Name</p>
                        <div className="flex items-center space-x-2">
                            <Tag size={15} />
                            <p className="text-l">Kategorien</p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-between">
                    <button
                        className="btn btn-ghost ml-3 space-x-1 px-5 py-6 hover:scale-105"
                        onClick={() => swipeAndRemove("left")}
                    >
                        <X size={30} />
                        <p className="text-3xl font-semibold">Next</p>
                    </button>

                    <button
                        className="btn btn-ghost mr-3 space-x-1 px-5 py-6 hover:scale-105"
                        onClick={() => swipeAndRemove("right")}
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
