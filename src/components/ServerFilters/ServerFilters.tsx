import { Card, Checkbox, Dot, Input, Select, Spacer } from '@geist-ui/core';
import React, { useEffect, useState } from 'react';
import useAvailableServerFilters from '../../hooks/data/useAvailableServerFilters';
import useDebounce from '../../hooks/useDebounce';
import { usePrevious } from '../../hooks/usePrevious';
import useServerFilters from '../../hooks/useServerFilters';
import CustomSelect from './CustomSelect';
import ServerModsFilter from './ServerModsFilter';

const GLOBAL_SETSTATE_OPTIONS = {
  scroll: false,
  shallow: true,
};

interface Props {
  filters: ReturnType<typeof useServerFilters>;
}

const ServerFilters: React.FC<Props> = ({ filters }) => {
  const { data: availableFilters } = useAvailableServerFilters();

  return (
    <>
      <Spacer h={1} />

      <Card>
        <div className="grid grid-cols-4 gap-6 py-4">
          <div>
            <ServerNameSearch value={filters.name} onChange={(val: string) => filters.setName(val || null, GLOBAL_SETSTATE_OPTIONS)} />
          </div>

          <div>
            <CustomSelect
              placeholder="Select map"
              label="Map"
              value={filters.island}
              clearable
              onChange={(value) => filters.setIsland((value as string) || null, GLOBAL_SETSTATE_OPTIONS)}
            >
              <NoneSelectOption />
              {availableFilters?.islands?.map((option, i) => (
                <Select.Option key={i} value={String(option.value)}>
                  {option?.label || option?.value} {option.count > 0 && <>({option.count})</>}
                </Select.Option>
              ))}
            </CustomSelect>
          </div>

          <div>
            <CustomSelect
              placeholder="Select version"
              label="Version"
              value={filters.version}
              onChange={(value) => filters.setVersion((value as string) || null, GLOBAL_SETSTATE_OPTIONS)}
            >
              <NoneSelectOption />
              {availableFilters?.versions.map((option, i) => (
                <Select.Option key={i} value={String(option.value)}>
                  <span>
                    {option?.label || option?.value} {option.count > 0 && <>({option.count})</>}
                  </span>

                  {option.value && (
                    <>
                      {option.highlighted && (
                        <>
                          <Spacer w={1 / 3} inline />
                          <Dot type="success" scale={3 / 4}></Dot>
                        </>
                      )}
                      {option.highlightedSecondary && (
                        <>
                          <Spacer w={1 / 3} inline />
                          <Dot className="dot-violet" type="success" scale={3 / 4}></Dot>
                        </>
                      )}
                    </>
                  )}
                </Select.Option>
              ))}
            </CustomSelect>
          </div>

          <div>
            <ServerModsFilter
              availableOptions={availableFilters?.mods?.filter((mod) => mod?.label) || []}
              selectedMods={filters.mods || []}
              onAddMod={(modId: string) => filters.setMods((prevMods) => [...new Set([...(prevMods || []), modId])], GLOBAL_SETSTATE_OPTIONS)}
              onRemoveMod={(modId: string) =>
                filters.setMods((prevMods) => {
                  if (prevMods !== null) {
                    const newMods = prevMods?.filter((m) => m !== modId);
                    if (newMods.length > 0) return newMods;
                  }

                  return null;
                }, GLOBAL_SETSTATE_OPTIONS)
              }
            />
          </div>

          <div>
            <Checkbox
              scale={4 / 3}
              checked={filters.firstPerson}
              onChange={(e) => filters.setFirstPerson(e.target.checked || null, GLOBAL_SETSTATE_OPTIONS)}
            >
              First person only
            </Checkbox>
          </div>

          <div>
            <Checkbox
              scale={4 / 3}
              checked={filters.official}
              onChange={(e) => filters.setOfficial(e.target.checked || null, GLOBAL_SETSTATE_OPTIONS)}
            >
              Official server
            </Checkbox>
          </div>

          <div>
            <Checkbox
              scale={4 / 3}
              checked={filters.experimental}
              onChange={(e) => filters.setExperimental(e.target.checked || null, GLOBAL_SETSTATE_OPTIONS)}
            >
              Experimental server
            </Checkbox>
          </div>

          <div>
            <Checkbox
              scale={4 / 3}
              checked={filters.hasNoQueue}
              onChange={(e) => filters.setHasNoQueue(e.target.checked || null, GLOBAL_SETSTATE_OPTIONS)}
            >
              Has no queue
            </Checkbox>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ServerFilters;

interface ServerNameSearchProps {
  disabled?: boolean;
  value?: string;
  initialValue?: string;
  onChange?: (val: string) => void;
}

const ServerNameSearch: React.FC<ServerNameSearchProps> = ({ disabled, value, initialValue, onChange }) => {
  const [serverNameInput, setServerNameInput] = useState<string>('');
  const debouncedServerNameInput = useDebounce(serverNameInput, 500);

  const previousDebouncedServerNameInput = usePrevious(debouncedServerNameInput);

  useEffect(() => {
    if (typeof previousDebouncedServerNameInput === 'undefined' || previousDebouncedServerNameInput === debouncedServerNameInput) return;

    if (onChange) onChange(debouncedServerNameInput);
  }, [debouncedServerNameInput]);

  useEffect(() => {
    if (typeof value === 'undefined') return;

    setServerNameInput(value);
  }, [value]);

  return (
    <>
      <Input
        placeholder="Search server name"
        clearable
        disabled={disabled}
        initialValue={initialValue}
        value={serverNameInput}
        onChange={(e) => setServerNameInput(e.target.value)}
        spellCheck={false}
      >
        Server name
      </Input>
    </>
  );
};

const NoneSelectOption: React.FC = () => {
  return (
    <>
      <Select.Option value={''}>None</Select.Option>
    </>
  );
};
