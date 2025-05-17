import { useState } from "react";

function CardStack() {
    const cardsData = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        text: `Card ${i}`,
    }));
    const [cards, setCards] = useState(cardsData);

    const handleSwipe = (direction: "left" | "right") => {
        setCards((prev) => prev.slice(1));
    };

    return (
        <div className="stack stack-top bg-black-500 mt-5 h-110 w-full justify-center">
            {cards.map((card) => {
                return (
                    <div
                        className="border-base-content card bg-base-100 flex border"
                        key={card.id}
                    >
                        {card.text}
                    </div>
                );
            })}
        </div>
    );
}

function Home() {
    return (
        <div className="mx-60 mt-10 min-h-screen justify-center px-4 sm:px-10 lg:px-60">
            <h1 className="text-4xl">Finde neue Freunde!</h1>
            <CardStack />
        </div>
    );
}

export default Home;
