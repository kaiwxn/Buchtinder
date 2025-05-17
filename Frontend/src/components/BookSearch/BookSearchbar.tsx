import { Search } from "lucide-react";

type BookSearchbarProps = {
    query: string;
    setQuery: (value: string) => void;
    onManualSearch: () => void;
};

function BookSearchbar({
    query,
    setQuery,
    onManualSearch,
}: BookSearchbarProps) {
    const handleSearch = () => {
        if (query.trim()) {
            onManualSearch();
        }
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

            <select className="select join-item w-fit">
                <option disabled selected>
                    Filter
                </option>
                <option>Neuste</option>
                <option>Relevanteste</option>
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
