import { AutoComplete, Spacer, Tag } from '@geist-ui/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { SelectOption, WorkshopMod } from '../../types/Types';
import http from '../../services/HTTP';
import { X } from '@geist-ui/react-icons';
import FormItemLabel from '../FormItemLabel/FormItemLabel';

const searchWorkshopModsRequest = async (searchTerm: string) =>
  await http
    .get(
      `/api/steam/workshop/search?` +
        new URLSearchParams({
          term: searchTerm,
        })
    )
    .then((response) => response.json());

const getWorkshopModsRequest = async (modIds: number[]) =>
  await http
    .get(
      `/api/steam/workshop?` +
        new URLSearchParams({
          modIds: modIds.join(','),
        })
    )
    .then((response) => response.json());

const RESULTS_LIMIT = 100;

interface Props {
  availableOptions: SelectOption[];
  selectedMods: string[];
  onAddMod?: (modId: string) => void;
  onRemoveMod?: (modId: string) => void;
}

const ServerModsFilter: React.FC<Props> = ({ availableOptions, selectedMods, onAddMod, onRemoveMod }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<WorkshopMod[]>([]);

  const [enrichedSelectedMods, setEnrichedSelectedMods] = useState<WorkshopMod[]>([]);

  const autoCompleteOptions: SelectOption[] = useMemo(
    () => (searchResults?.length > 0 ? searchResults.map((mod: WorkshopMod) => ({ label: mod.name, value: mod.id, count: 0 })) : availableOptions),
    [availableOptions, searchResults]
  );

  function changeHandler(value: string) {
    setSearchValue(value);
  }

  function selectHandler(value: string) {
    if (onAddMod) onAddMod(value);

    // Timeout because this component is weird
    setTimeout(() => {
      setSearchValue('');
      if (inputRef.current) inputRef.current.blur();
    }, 50);
  }

  function deleteHandler(mod: WorkshopMod) {
    if (onRemoveMod) onRemoveMod(mod.id);
  }

  // @TODO: debounce this
  useEffect(() => {
    const modIds = selectedMods?.map(Number) || [];
    if (selectedMods.length === 0) return setEnrichedSelectedMods([]);

    (async () => {
      const modResults: WorkshopMod[] = await getWorkshopModsRequest(modIds);
      setEnrichedSelectedMods(modResults);
    })();
  }, [selectedMods]);

  useEffect(() => {
    if (!debouncedSearchValue) return setSearchResults([]);

    (async () => {
      setIsSearching(true);

      const modResults: WorkshopMod[] = await searchWorkshopModsRequest(debouncedSearchValue);

      // Search results, sort by players, limit to top 100 results
      const optionsResult = modResults.slice(0, RESULTS_LIMIT);
      setSearchResults(optionsResult);

      setIsSearching(false);
    })();
  }, [debouncedSearchValue]);

  return (
    <>
      <FormItemLabel label="Mods">
        <AutoComplete
          placeholder="Select or search server mods"
          options={autoCompleteOptions.map((e) => ({ label: String(e.label || e.value), value: String(e.value) }))}
          value={searchValue}
          onChange={changeHandler}
          onSelect={selectHandler}
          width="100%"
          searching={isSearching}
          clearable
          ref={inputRef}
        />
      </FormItemLabel>

      {enrichedSelectedMods.length > 0 && (
        <div className="space-y-2 mt-2">
          {enrichedSelectedMods
            .filter((mod) => mod?.name)
            .map((mod, i) => (
              <React.Fragment key={i}>
                <ModTag mod={mod} onDelete={() => deleteHandler(mod)} />
              </React.Fragment>
            ))}
        </div>
      )}
    </>
  );
};

export default ServerModsFilter;

interface ModTagProps {
  mod: WorkshopMod;
  onDelete?: () => void;
}

const ModTag: React.FC<ModTagProps> = ({ mod, onDelete }) => {
  function onDeleteClick() {
    if (onDelete) onDelete();
  }

  return (
    <>
      <Tag type="lite" mr={'0.5rem'}>
        <div className="flex items-center">
          <span>{mod?.name}</span>
          <Spacer w={1 / 4} />
          <X onClick={onDeleteClick} size={16} className="cursor-pointer" />
        </div>
      </Tag>
    </>
  );
};
