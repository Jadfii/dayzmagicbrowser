import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AutoComplete } from '@geist-ui/core';
import ServerOption from './ServerOption';
import useDebounce from '../../hooks/useDebounce';
import { Search } from '@geist-ui/react-icons';
import useSearchServers from '../../hooks/data/useSearchServers';

const ELEMENT_ID = 'servers-search';

const ServersSearch: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue: string = useDebounce(searchValue, 500);

  const { data, isFetching } = useSearchServers(debouncedSearchValue);

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
        options={
          data?.map((server) => (
            <AutoComplete.Option value={server.id} key={`${server.ipAddress}:${server.gamePort}-result`}>
              <ServerOption server={server} handleClick={handleOptionClick} />
            </AutoComplete.Option>
          )) ?? []
        }
        value={searchValue}
        onSearch={searchHandler}
        scale={4 / 3}
        width="100%"
        searching={isFetching}
        clearable
        id={ELEMENT_ID}
      />
    </>
  );
};

export default ServersSearch;
