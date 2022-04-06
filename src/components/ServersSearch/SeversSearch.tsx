import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AutoComplete } from '@geist-ui/react';
import ServerOption from './ServerOption';
import useDebounce from '../../hooks/useDebounce';
import { Search } from '@geist-ui/react-icons';
import { Server } from '../../types/Types';

const ELEMENT_ID = 'servers-search';
const RESULTS_LIMIT = 100;

const ServersSearch: React.FC = () => {
  const [options, setOptions] = useState<React.ReactElement[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue: string = useDebounce(searchValue, 500);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [hasInsertedIcon, setHasInsertedIcon] = useState<boolean>(false);

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
    if (!debouncedSearchValue) return setOptions([]);

    (async () => {
      setIsSearching(true);

      const serverResults = await fetch(
        `/api/servers/search?` +
          new URLSearchParams({
            name: debouncedSearchValue,
          })
      ).then((response) => response.json());

      // Search results, sort by players, map to option component, limit to top 100 results
      const optionsResult = serverResults
        .sort((a: Server, b: Server) => {
          return b?.playerCount + b?.queueCount - (a?.playerCount + a?.queueCount);
        })
        .map((server: Server, i: number) => (
          <AutoComplete.Item value={server.id} key={i}>
            <ServerOption server={server} handleClick={handleOptionClick} />
          </AutoComplete.Item>
        ))
        .slice(0, RESULTS_LIMIT);
      setOptions(optionsResult);

      setIsSearching(false);
    })();

    return undefined;
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

    setHasInsertedIcon(true);
  }, [hasInsertedIcon]);

  return (
    <>
      <AutoComplete
        placeholder="Search server"
        options={options}
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
