
import { useState } from 'react';
import Card from './TinderCard';

type CardData = {
    id: number;
    text: string;
};

function CardStack({ data }: { data: CardData[] }) {
    const [cards, setCards] = useState(data);

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

export default CardStack;