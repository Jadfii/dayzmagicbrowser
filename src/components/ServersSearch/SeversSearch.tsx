import React, { useState } from 'react';
import { AutoComplete } from '@geist-ui/core';
import ServerOption from './ServerOption';
import useDebounce from '../../hooks/useDebounce';
import useSearchServers from '../../hooks/data/useSearchServers';

const ELEMENT_ID = 'servers-search';

const ServersSearch: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue: string = useDebounce(searchValue, 500);

  const { data, isFetching } = useSearchServers(debouncedSearchValue);

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
