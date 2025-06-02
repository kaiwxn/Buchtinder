import CardStack from "./TinderCardStack";



const cardsData = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    text: `Card ${i}`,
}));


function Home() {
    return (
        <div className="mx-0.5 mt-10 min-h-screen justify-center px-4 sm:mx-60 sm:px-10 lg:px-60">
            <CardStack data={cardsData} />
        </div>
    );
}

export default Home;
