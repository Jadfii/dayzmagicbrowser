import React, { useCallback, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AutoComplete } from '@geist-ui/react';
import Fuse from 'fuse.js';
import { ServersContext } from '../../contexts/ServersProvider';
import ServerOption from './ServerOption';
import useDebounce from '../../hooks/useDebounce';
import { Search } from '@geist-ui/react-icons';

const ELEMENT_ID = 'servers-search';
const RESULTS_LIMIT = 100;

const ServersSearch: React.FC = () => {
  const { servers } = useContext(ServersContext);

  const [options, setOptions] = useState<React.ReactElement[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [hasInsertedIcon, setHasInsertedIcon] = useState<boolean>(false);

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

  // Inject the custom icon
  // Workaround since AutoComplete doesn't accept an icon ??
  useEffect(() => {
    // Icon is already injected. Do nothing
    if (hasInsertedIcon) return;

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

    ReactDOM.render(<Search />, iconElement);

    rightIconElement.remove();
    setHasInsertedIcon(true);
  }, []);

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
        id={ELEMENT_ID}
      />
    </>
  );
};

export default ServersSearch;
