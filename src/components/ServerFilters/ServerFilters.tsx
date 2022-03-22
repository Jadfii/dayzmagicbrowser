import { Card, Checkbox, Dot, Input, Select, Spacer } from '@geist-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ServerFiltersContext } from '../../contexts/ServerFiltersProvider';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { GameContext } from '../../contexts/GameProvider';
import { Server, SelectOption } from '../../types/Types';
import useDebounce from '../../hooks/useDebounce';
interface Props {
  servers: Server[];
}

const ServerFilters: React.FC<Props> = ({ servers }) => {
  const workerRef = useRef<Worker>();

  const { islands } = useContext(IslandsContext);
  const { isLatestGameVersion } = useContext(GameContext);
  const {
    serverIsland,
    setServerIsland,
    serverVersion,
    setServerVersion,
    serverMods,
    setServerMods,
    isFirstPersonOnly,
    setIsFirstPersonOnly,
    isOfficial,
    setIsOfficial,
    isExperimental,
    setIsExperimental,
    hasNoQueue,
    setHasNoQueue,
  } = useContext(ServerFiltersContext);

  const [availableVersions, setAvailableVersions] = useState<SelectOption[]>([]);
  const [availableIslands, setAvailableIslands] = useState<SelectOption[]>([]);
  const [availableMods, setAvailableMods] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (!servers?.length || !islands?.length) return;

    workerRef.current?.postMessage({ servers, islands });
  }, [servers, islands]);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../workers/makeServerFilters.js', import.meta.url));
    workerRef.current.onmessage = (e) => {
      setAvailableVersions(e?.data?.versionsValues || []);
      setAvailableIslands(e?.data?.islandsValues || []);
      setAvailableMods(e?.data?.modsValues || []);
    };

    return () => {
      workerRef?.current?.terminate();
    };
  }, []);

  return (
    <>
      <Spacer h={1} />

      <Card>
        <div className="grid grid-cols-4 gap-6 py-4 items-center">
          <div>
            <ServerNameSearch />
          </div>

          <div>
            <Select placeholder="Map" value={serverIsland} onChange={(value) => setServerIsland(value as string)}>
              {availableIslands.map((option, i) => (
                <Select.Option key={i} value={option.value}>
                  {option.label} {option.occurrences > 0 && <>({option.occurrences})</>}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <Select placeholder="Version" value={serverVersion} onChange={(value) => setServerVersion(value as string)}>
              {availableVersions.map((option, i) => (
                <Select.Option key={i} value={option.value}>
                  <span>
                    {option.label} {option.occurrences > 0 && <>({option.occurrences})</>}
                  </span>

                  {option.value && (
                    <>
                      {isLatestGameVersion(option.value) && (
                        <>
                          <Spacer w={1 / 3} inline />
                          <Dot type="success" scale={3 / 4}></Dot>
                        </>
                      )}
                      {isLatestGameVersion(option.value, true) && (
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
          </div>
        </div>
      </Card>
    </>
  );
};

export default ServerFilters;

const ServerNameSearch: React.FC = () => {
  const { setServerName } = useContext(ServerFiltersContext);

  const [serverNameInput, setServerNameInput] = useState<string>('');
  const debouncedServerNameInput = useDebounce(serverNameInput, 500);

  useEffect(() => {
    setServerName(debouncedServerNameInput);
  }, [debouncedServerNameInput]);

  return (
    <>
      <Input placeholder="Server name" clearable value={serverNameInput} onChange={(e) => setServerNameInput(e.target.value)} />
    </>
  );
};
