import { Search } from "lucide-react";

type BookSearchbarProps = {
    query: string;
    setLastQuery: (query: string) => void;
    setQuery: (value: string) => void;
    setPage: (page: number) => void;
    fetchBooks: (q: string, pageNumber: number) => void;
    scrollToTop: () => void;
};

export default function BookSearchbar({
    query,
    setLastQuery,
    setQuery,
    setPage,
    fetchBooks,
}: BookSearchbarProps) {
    const handleSearch = () => {
        setLastQuery(query);     // update lastQuery to match input
        setPage(0);              // reset to page 0
        fetchBooks(query, 0);
    };

    return (
        <div className="join mb-5 flex">
            <label className="input flex items-center">
                <Search color="#6a7282" size={15} />
                <input
                    type="search"
                    required
                    placeholder="Suchbegriff eingeben..."
                    className="join-item ml-2"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
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
            >
                Suchen
            </button>
        </div>
    );
}
