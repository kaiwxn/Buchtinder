import { useEffect, useState } from "react";
import Card from "./TinderCard";

const cardsData = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    text: `Card ${i}`,
}));



function CardStack() {
    const [cards, setCards] = useState(cardsData);

    return (
        <div className="mt-5 flex justify-center">
            {cards.map((card: any) => (
                <Card
                    key={card.id}
                    {...card}
                    setCards={setCards}
                    cards={cards}
                />
            ))}
        </div>
    );
}

function Home() {
    return (
        <div className="mx-0.5 mt-10 min-h-screen justify-center px-4 sm:mx-60 sm:px-10 lg:px-60">
            <CardStack />
        </div>
    );
}

export default Home;
