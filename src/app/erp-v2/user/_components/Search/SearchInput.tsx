"use client";

type Props = {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  setCurrentPage: (val: number) => void;
};

const SearchInput: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <label className="relative w-full max-w-sm">
      <input
        type="search"
        className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </g>
      </svg>
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          ×
        </button>
      )}
    </label>
  );
};

export default SearchInput;
