import { Card, Checkbox, Dot, Input, Select, Spacer } from '@geist-ui/react';
import React, { useEffect, useState } from 'react';
import useAvailableServerFilters from '../../hooks/useAvailableServerFilters';
import useDebounce from '../../hooks/useDebounce';
import { usePrevious } from '../../hooks/usePrevious';
import useServerFilters from '../../hooks/useServerFilters';
import { SERVER_FILTER } from '../../types/Types';

const ServerFilters: React.FC = () => {
  const { getFilter, setFilter } = useServerFilters();
  const { availableFilters } = useAvailableServerFilters();

  return (
    <>
      <Spacer h={1} />

      <Card>
        <div className="grid grid-cols-4 gap-6 py-4 items-center">
          <div>
            <ServerNameSearch value={getFilter(SERVER_FILTER.NAME) as string} onChange={(val) => setFilter(SERVER_FILTER.NAME, val)} />
          </div>

          <div>
            <Select
              placeholder="Map"
              value={getFilter(SERVER_FILTER.ISLAND)}
              clearable
              onChange={(value) => setFilter(SERVER_FILTER.ISLAND, value as string)}
            >
              <NoneSelectOption />
              {availableFilters?.islands?.map((option, i) => (
                <Select.Option key={i} value={String(option.value)}>
                  {option?.label || option?.value} {option.count > 0 && <>({option.count})</>}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <Select
              placeholder="Version"
              value={getFilter(SERVER_FILTER.VERSION)}
              onChange={(value) => setFilter(SERVER_FILTER.VERSION, value as string)}
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
            </Select>
          </div>

          <div>
            <Select
              placeholder="Mods"
              value={getFilter(SERVER_FILTER.MODS)}
              onChange={(value) => setFilter(SERVER_FILTER.MODS, (value as string[]).join(','))}
              width="100%"
              multiple
            >
              {availableFilters?.mods
                ?.filter((mod) => mod?.label)
                ?.map((option, i) => (
                  <Select.Option key={i} value={String(option.value)}>
                    {option?.label || option?.value} {option.count > 0 && <>({option.count})</>}
                  </Select.Option>
                ))}
            </Select>
          </div>

          {/*<div>
            <Checkbox scale={4 / 3} checked={isFirstPersonOnly} onChange={(e) => setIsFirstPersonOnly(e.target.checked)}>
              First person only
            </Checkbox>
          </div>

          <div>
            <Checkbox scale={4 / 3} checked={isOfficial} onChange={(e) => setIsOfficial(e.target.checked)}>
              Official server
            </Checkbox>
          </div>

          <div>
            <Checkbox scale={4 / 3} checked={isExperimental} onChange={(e) => setIsExperimental(e.target.checked)}>
              Experimental server
            </Checkbox>
          </div>

          <div>
            <Checkbox scale={4 / 3} checked={hasNoQueue} onChange={(e) => setHasNoQueue(e.target.checked)}>
              Has no queue
            </Checkbox>
          </div>*/}
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
        placeholder="Server name"
        clearable
        disabled={disabled}
        initialValue={initialValue}
        value={serverNameInput}
        onChange={(e) => setServerNameInput(e.target.value)}
      />
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
