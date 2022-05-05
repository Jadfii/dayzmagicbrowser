import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AutoComplete } from '@geist-ui/core';
import ServerOption from './ServerOption';
import useDebounce from '../../hooks/useDebounce';
import { Search } from '@geist-ui/react-icons';
import { Server } from '../../types/Types';
import { sortServersByPlayerCount } from '../../utils/server.util';
import http from '../../services/HTTP';

const ELEMENT_ID = 'servers-search';
const RESULTS_LIMIT = 100;

const ServersSearch: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Server[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue: string = useDebounce(searchValue, 500);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const hasInsertedIcon = useRef<boolean>(false);

  function searchHandler(value: string) {
    setSearchValue(value);
  }

  function handleOptionClick() {
    // A little delay is required because the AutoComplete component
    // has some weird behaviour
    setTimeout(() => {
      setSearchValue('');

      const inputEl = document.getElementById(ELEMENT_ID);
      inputEl?.blur();
    }, 50);
  }

  useEffect(() => {
    if (!debouncedSearchValue) return setSearchResults([]);

    (async () => {
      setIsSearching(true);

      const serverResults: Server[] = await http
        .get(
          `/api/servers/search?` +
            new URLSearchParams({
              name: debouncedSearchValue,
            })
        )
        .then((response) => response.json());

      // Search results, sort by players, limit to top 100 results
      const optionsResult = sortServersByPlayerCount(serverResults).slice(0, RESULTS_LIMIT);
      setSearchResults(optionsResult);

      setIsSearching(false);
    })();

    return undefined;
  }, [debouncedSearchValue]);

  // Inject the custom icon
  // Workaround since AutoComplete doesn't accept an icon ??
  useEffect(() => {
    // Icon is already injected. Do nothing
    if (hasInsertedIcon?.current) return;

    const inputElement = document.getElementById(ELEMENT_ID);
    if (!inputElement) return;

    inputElement.classList.add('left-icon');
    inputElement.classList.remove('right-icon');

    const renderElement = inputElement.parentElement;
    if (!renderElement) return;

    const iconElement = document.createElement('span');

    const rightIconElement = document.querySelector('.input-icon');
    if (!rightIconElement) return;

    iconElement.className = rightIconElement.className;
    renderElement.prepend(iconElement);

    const iconRoot = createRoot(iconElement);
    iconRoot.render(<Search />);

    hasInsertedIcon.current = true;
  }, []);

  return (
    <>
      <AutoComplete
        placeholder="Search server"
        options={searchResults.map((server: Server, i: number) => (
          <AutoComplete.Option value={server.id} key={i}>
            <ServerOption server={server} handleClick={handleOptionClick} />
          </AutoComplete.Option>
        ))}
        value={searchValue}
        onSearch={searchHandler}
        scale={4 / 3}
        width="100%"
        searching={isSearching}
        clearable
        id={ELEMENT_ID}
      />
    </>
  );
};

export default ServersSearch;
