import { useState } from "react";
import Card from "./TinderCard";
import { CardData } from "./types";

const BACKUP_IMAGE_SRC =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSiaxXHKRBmNrpzuius2fLvoyrPjPWiu2jDg&s";

const BACKUP_PROFILE_IMAGE_SRC =
    "https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg";

const cardsData = Array.from({ length: 5 }, (_, i) => ({
    friend_id: i + 1,
    friend_name: "Max " + (i + 1),
    imgSrc: BACKUP_PROFILE_IMAGE_SRC,
    favoriteCategories: ["Fantasy", "Science Fiction", "Mystery", "Romance", "Thriller"],
    bookSrcs: [
        BACKUP_IMAGE_SRC,
        BACKUP_IMAGE_SRC,
        BACKUP_IMAGE_SRC,
        BACKUP_IMAGE_SRC,
        BACKUP_IMAGE_SRC,
    ],
}));

function CardStack() {
    const [cards, setCards] = useState(cardsData);

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
