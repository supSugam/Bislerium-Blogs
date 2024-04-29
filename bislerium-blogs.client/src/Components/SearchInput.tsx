import { useState } from 'react';
import Dropdown from './Reusables/Dropdown';
import { SearchIcon } from 'lucide-react';

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  return (
    <Dropdown
      targetComponent={
        <div className="flex justify-center gap-3 items-center bg-gray-100 rounded-md px-2">
          <SearchIcon size={20} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search for blogs..."
            className="focus:outline-none px-1 py-2 placeholder:text-sm text-sm bg-gray-100 w-full"
          />
        </div>
      }
      items={[]}
    />
  );
};

export default SearchInput;
