import { Card, Checkbox, Dot, Input, Select, Spacer } from '@geist-ui/react';
import React, { useEffect, useState } from 'react';
import useAvailableServerFilters from '../../hooks/useAvailableServerFilters';
import useDebounce from '../../hooks/useDebounce';
import { usePrevious } from '../../hooks/usePrevious';
import useServerFilters from '../../hooks/useServerFilters';

const ServerFilters: React.FC = () => {
  const filters = useServerFilters();
  const { availableFilters } = useAvailableServerFilters();

  return (
    <>
      <Spacer h={1} />

      <Card>
        <div className="grid grid-cols-4 gap-6 py-4 items-center">
          <div>
            <ServerNameSearch value={filters.name} onChange={filters.setName} />
          </div>

          <div>
            <Select placeholder="Map" value={filters.island} clearable onChange={(value) => filters.setIsland((value as string) || null)}>
              <NoneSelectOption />
              {availableFilters?.islands?.map((option, i) => (
                <Select.Option key={i} value={String(option.value)}>
                  {option?.label || option?.value} {option.count > 0 && <>({option.count})</>}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <Select placeholder="Version" value={filters.version} onChange={(value) => filters.setVersion((value as string) || null)}>
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
              value={filters.mods}
              onChange={(value) => filters.setMods((value as string[]).join(','))}
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

          <div>
            <Checkbox scale={4 / 3} checked={filters.firstPerson} onChange={(e) => filters.setFirstPerson(e.target.checked || null)}>
              First person only
            </Checkbox>
          </div>

          <div>
            <Checkbox scale={4 / 3} checked={filters.official} onChange={(e) => filters.setOfficial(e.target.checked || null)}>
              Official server
            </Checkbox>
          </div>

          <div>
            <Checkbox scale={4 / 3} checked={filters.experimental} onChange={(e) => filters.setExperimental(e.target.checked || null)}>
              Experimental server
            </Checkbox>
          </div>

          {/*<div>
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
