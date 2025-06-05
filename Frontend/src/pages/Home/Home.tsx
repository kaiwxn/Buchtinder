import CardStack from "./TinderCardStack";

const BACKUP_IMAGE_SRC =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSiaxXHKRBmNrpzuius2fLvoyrPjPWiu2jDg&s";

const BACKUP_PROFILE_IMAGE_SRC =
    "https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg";

const cardsData = Array.from({ length: 10 }, () => ({
    friend_id: 1,
    friend_name: "Max",
    imgSrc: BACKUP_PROFILE_IMAGE_SRC,
    favoriteCategories: ["Fantasy", "Science Fiction", "Mystery"],
    bookSrcs: [
        BACKUP_IMAGE_SRC,
        BACKUP_IMAGE_SRC,
        BACKUP_IMAGE_SRC,
        BACKUP_IMAGE_SRC,
        BACKUP_IMAGE_SRC,
    ],
}));

function Home() {
    return (
        <div className="mx-0.5 mt-10 min-h-screen justify-center px-4 sm:mx-60 sm:px-10 lg:px-60">
            <CardStack data={cardsData} />
        </div>
    );
}

export default Home;
