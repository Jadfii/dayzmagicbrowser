import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AutoComplete } from '@geist-ui/react';
import Fuse from 'fuse.js';
import { ServersContext } from '../../contexts/ServersProvider';
import ServerOption from './ServerOption';
import useDebounce from '../../hooks/useDebounce';

const RESULTS_LIMIT = 100;

const ServersSearch: React.FC = () => {
  const { servers } = useContext(ServersContext);

  const [options, setOptions] = useState<React.ReactElement[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  function searchHandler(value: string) {
    setSearchValue(value);
  }

  const selectHandler = useCallback(
    (value: string) => {
      console.log(servers.find((server) => server.id === value));
    },
    [servers]
  );

  useEffect(() => {
    if (!debouncedSearchValue) return setOptions([]);

    setIsSearching(true);
    const fuseSearch = new Fuse(servers, {
      keys: ['name', 'ip', 'mods.name'],
      threshold: 0.1,
      includeMatches: true,
      includeScore: true,
    }).search(debouncedSearchValue);

    console.log(fuseSearch);

    // Search results, sort by players, map to option component, limit to top 100 results
    const optionsResult = fuseSearch
      .filter((result) => result?.item)
      .sort((a, b) => {
        return b?.item.players + b?.item.queue - (a?.item.players + a?.item.queue);
      })
      .map((result) => <ServerOption server={result?.item} />)
      .slice(0, RESULTS_LIMIT);
    setOptions(optionsResult);

    setIsSearching(false);
  }, [debouncedSearchValue]);

  return (
    <>
      <AutoComplete
        placeholder="Search server"
        options={options}
        value={searchValue}
        onSearch={searchHandler}
        onSelect={selectHandler}
        scale={4 / 3}
        width="100%"
        searching={isSearching}
      />
    </>
  );
};

export default ServersSearch;
