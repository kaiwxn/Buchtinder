import { Search } from "lucide-react";

type BookSearchbarProps = {
    query: string;
    setQuery: (value: string) => void;
    order: string;
    setOrder: (value: string) => void;
    onManualSearch: () => void;
};

function BookSearchbar({
    query,
    setQuery,
    order,
    setOrder,
    onManualSearch,
}: BookSearchbarProps) {
    const handleSearch = () => {
        onManualSearch();
    };

    return (
        <div className="join mb-5 flex">
            <label className="input flex items-center">
                <Search className="text-gray-500" size={15} />
                <input
                    type="search"
                    placeholder="Suchbegriff eingeben..."
                    className="join-item ml-2 bg-transparent focus:outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                    aria-label="Bücher suchen"
                />
            </label>

            <select
                className="select join-item w-fit"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                aria-label="Sortierung"
            >
                <option value="relevance">Relevanteste</option>
                <option value="newest">Neuste</option>
            </select>

            <button
                className="btn btn-neutral join-item shadow-none"
                onClick={handleSearch}
                type="button"
            >
                Suchen
            </button>
        </div>
    );
}

export default BookSearchbar;
