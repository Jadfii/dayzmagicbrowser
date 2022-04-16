import { Card, Checkbox, Dot, Input, Select, Spacer } from '@geist-ui/react';
import React, { useEffect, useState } from 'react';
import useAvailableServerFilters from '../../hooks/useAvailableServerFilters';
import useDebounce from '../../hooks/useDebounce';
import useServerFilters from '../../hooks/useServerFilters';

const ServerFilters: React.FC = () => {
  const { name, setName, island, setIsland, version, setVersion, mods, setMods } = useServerFilters();
  const { availableFilters } = useAvailableServerFilters();

  return (
    <>
      <Spacer h={1} />

      <Card>
        <div className="grid grid-cols-4 gap-6 py-4 items-center">
          <div>
            <ServerNameSearch initialValue={name} onChange={setName} />
          </div>

          <div>
            <Select placeholder="Map" value={island} onChange={(value) => setIsland(value as string)}>
              {availableFilters?.islands?.map((option, i) => (
                <Select.Option key={i} value={String(option.value)}>
                  {option?.label || option?.value} {option.count > 0 && <>({option.count})</>}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <Select placeholder="Version" value={version} onChange={(value) => setVersion(value as string)}>
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
            <Select placeholder="Mods" value={mods} onChange={(value) => setMods(value as string[])} width="100%" multiple>
              {availableFilters?.mods?.slice(0, 20)?.map((option, i) => (
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
  initialValue?: string;
  onChange?: (val: string) => void;
}

const ServerNameSearch: React.FC<ServerNameSearchProps> = ({ initialValue, onChange }) => {
  const [serverNameInput, setServerNameInput] = useState<string>('');
  const debouncedServerNameInput = useDebounce(serverNameInput, 500);

  useEffect(() => {
    if (onChange) onChange(debouncedServerNameInput);
  }, [debouncedServerNameInput]);

  return (
    <>
      <Input
        placeholder="Server name"
        clearable
        initialValue={initialValue}
        value={serverNameInput}
        onChange={(e) => setServerNameInput(e.target.value)}
      />
    </>
  );
};
