
import { useState } from 'react';
import Card from './TinderCard';
import { CardData } from './types';

function CardStack({ data }: { data: CardData[] }) {
    const [cards, setCards] = useState(data);

    return (
        <div className="mt-5 flex justify-center">
            {cards.map((card: CardData, i) => (
                <Card
                    id={i}
                    {...card}
                    setCards={setCards}
                    cardNumber={cards.length}
                />
            ))}
        </div>
    );
}

export default CardStack;