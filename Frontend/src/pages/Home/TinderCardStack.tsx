import { useState } from "react";
import Card from "./TinderCard";
import { CardData } from "./types";

function CardStack({ data }: { data: CardData[] }) {
    const [cards, setCards] = useState(data);

    return (
        <div className="mt-5 flex justify-center">
            {cards.map((card: CardData) => (
                <Card
                    key={card.friend_id}
                    {...card}
                    setCards={setCards}
                    cards={cards}
                />
            ))}
        </div>
    );
}

export default CardStack;
