type PageChangerProps = {
    page: number;
    results: any[];
    setPage: (page: number) => void;
};

const RESULTS_PER_PAGE = 10;

function PageChanger({
    page,
    setPage,
    results,
}: PageChangerProps) {
    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    return (
        <div className="join flex justify-center">
            <button
                className="join-item btn btn-ghost"
                onClick={handlePreviousPage}
                disabled={page === 0}
            >
                «
            </button>
            <button className="join-item btn btn-ghost">{page}</button>
            <button
                className="join-item btn btn-ghost"
                onClick={handleNextPage}
                disabled={results.length < RESULTS_PER_PAGE}
            >
                »
            </button>
        </div>
    );
}

export default PageChanger;