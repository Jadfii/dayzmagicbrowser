import { AutoComplete, Spacer, Tag } from '@geist-ui/core';
import React, { useMemo, useRef, useState } from 'react';
import { useDebounceWithPending } from '../../hooks/useDebounce';
import { SelectOption, WorkshopMod } from '../../types/Types';
import { X } from '@geist-ui/react-icons';
import FormItemLabel from '../FormItemLabel/FormItemLabel';
import useWorkshopMods from '../../hooks/data/useWorkshopMods';
import useSearchWorkshopMods from '../../hooks/data/useSearchWorkshopMods';

interface Props {
  availableOptions: SelectOption[];
  selectedMods: string[];
  onAddMod?: (modId: string) => void;
  onRemoveMod?: (modId: string) => void;
}

const ServerModsFilter: React.FC<Props> = ({ availableOptions, selectedMods, onAddMod, onRemoveMod }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useState<string>('');
  const { value: debouncedSearchValue, isPending: isPendingSearchValue } = useDebounceWithPending(searchValue, 500);

  const { data: enrichedSelectedMods } = useWorkshopMods(selectedMods || []);
  const { data: modSearchResults, isFetching: isLoadingModSearchResults } = useSearchWorkshopMods(debouncedSearchValue);

  const isSearchingMods = useMemo(() => isPendingSearchValue || isLoadingModSearchResults, [isPendingSearchValue, isLoadingModSearchResults]);

  const autoCompleteOptions: SelectOption[] = useMemo(
    () =>
      searchValue.length > 0 && !isSearchingMods && modSearchResults
        ? modSearchResults?.map((mod: WorkshopMod) => ({ label: mod.name, value: mod.id, count: 0 }))
        : availableOptions,
    [availableOptions, modSearchResults, searchValue, isSearchingMods]
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
          searching={isSearchingMods}
          clearable
          ref={inputRef}
        >
          <AutoComplete.Empty>
            <span>No mods found</span>
          </AutoComplete.Empty>
        </AutoComplete>
      </FormItemLabel>

      {enrichedSelectedMods?.length && (
        <div className="mt-2 space-y-2">
          {enrichedSelectedMods
            .filter((mod) => mod?.name)
            .map((mod) => (
              <ModTag mod={mod} onDelete={() => deleteHandler(mod)} key={String(mod.id)} />
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
