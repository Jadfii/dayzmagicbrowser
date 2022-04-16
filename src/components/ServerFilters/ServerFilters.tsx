import { Card, Checkbox, Dot, Input, Select, Spacer } from '@geist-ui/react';
import React, { useEffect, useState } from 'react';
import { SelectOption } from '../../types/Types';
import useDebounce from '../../hooks/useDebounce';
import { useRouter } from 'next/router';

function useServerFilters() {
  const router = useRouter();

  // Filters
  const [name, setName] = useState<string>('');
  const [island, setIsland] = useState<string>('');
  const [version, setVersion] = useState<string>('');

  // Apply filters to URL
  useEffect(() => {
    const filters = {
      ...(name ? { name } : {}),
      ...(island ? { island } : {}),
      ...(version ? { version } : {}),
    };

    router.push({
      query: filters,
    });
  }, [name, island, version]);

  return { name, setName, island, setIsland, version, setVersion };
}
interface Props {
  availableFilters: {
    islands: SelectOption[];
    versions: SelectOption[];
  };
}

const ServerFilters: React.FC<Props> = ({ availableFilters }) => {
  const { name, setName, island, setIsland, version, setVersion } = useServerFilters();

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
                <Select.Option key={i} value={option.value}>
                  {option?.label || option?.value} {option.count > 0 && <>({option.count})</>}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <Select placeholder="Version" value={version} onChange={(value) => setVersion(value as string)}>
              {availableFilters?.versions.map((option, i) => (
                <Select.Option key={i} value={option.value}>
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

          {/*<div>
            <Select disabled placeholder="Mods" value={serverMods} onChange={(value) => setServerMods(value as string[])} width="100%" multiple>
              {availableMods.map((option, i) => (
                <Select.Option key={i} value={option.value}>
                  {option.label} {option.occurrences > 0 && <>({option.occurrences})</>}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
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
