import { useEffect, useState } from "react";
import Card from "./TinderCard";
import { CardData } from "./types";

function CardStack() {
    const [cards, setCards] = useState<CardData[]>([]);

    const fetchCards = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/tinder/get?user_id=${sessionStorage.getItem("token")}`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch cards");
            }
            const data: CardData[] = await response.json();
            setCards(data);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    };

    useEffect(() => {
        if (cards.length <= 0) {
            fetchCards();
        }
    }, []);

    return (
        <div className="mt-5 flex justify-center">
            {cards.map((card: CardData) => (
                <Card
                    key={card.user_id}
                    {...card}
                    setCards={setCards}
                    cards={cards}
                />
            ))}
            {cards.length === 0 && (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <span className="loading loading-spinner loading-xl"></span>
                    <p className="text-gray-500">Weitere Freunde kommen ...</p>
                </div>
            )}
        </div>
    );
}

export default CardStack;
