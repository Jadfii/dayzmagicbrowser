import { Card, Checkbox, Dot, Input, Select, Spacer } from '@geist-ui/react';
import React, { useContext, useMemo } from 'react';
import { ServerFiltersContext } from '../../contexts/ServerFiltersProvider';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { ServersContext } from '../../contexts/ServersProvider';
import { GameContext } from '../../contexts/GameProvider';

interface SelectOption {
  label: string;
  value: string;
  occurrences: number;
}

interface Props {
  visible: boolean;
}

const ServerFilters: React.FC<Props> = ({ visible }) => {
  const { servers } = useContext(ServersContext);
  const { getIslandByTerrain } = useContext(IslandsContext);
  const { isLatestGameVersion } = useContext(GameContext);
  const {
    serverName,
    setServerName,
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

  const availableVersions: SelectOption[] = useMemo(
    () => [
      { label: 'None', value: '', occurrences: 0 },
      ...[
        ...new Set(
          servers.reduce<SelectOption[]>((acc, curr) => {
            const option = { label: curr.version, value: curr.version, occurrences: 1 };

            const foundIdx = acc.findIndex((o) => o.value === option.value);
            if (foundIdx === -1) {
              acc.push(option);
            } else {
              acc[foundIdx].occurrences += 1;
            }

            return acc;
          }, [])
        ),
      ]
        .sort((a, b) => a.label.localeCompare(b.label))
        .reverse(),
    ],
    [servers]
  );
  const availableIslands: SelectOption[] = useMemo(
    () => [
      { label: 'None', value: '', occurrences: 0 },
      ...servers
        .reduce<SelectOption[]>((acc, curr) => {
          const island = getIslandByTerrain(curr?.island);
          const option = { label: island?.name || curr?.island, value: island?.terrainId || curr?.island, occurrences: 1 };

          if (!option.label) return acc;

          const foundIdx = acc.findIndex((o) => o.value === option.value);
          if (foundIdx === -1) {
            acc.push(option);
          } else {
            acc[foundIdx].occurrences += 1;
          }

          return acc;
        }, [])
        .sort((a, b) => b.occurrences - a.occurrences),
    ],
    [servers, getIslandByTerrain]
  );
  const availableMods: SelectOption[] = useMemo(
    () =>
      servers
        .reduce<SelectOption[]>((acc, curr) => {
          if (!curr?.mods?.length) return acc;

          curr.mods.forEach((mod) => {
            const option = { label: mod.name, value: mod.steamId, occurrences: 1 };

            const foundIdx = acc.findIndex((o) => o.value === option.value);
            if (foundIdx === -1) {
              acc.push(option);
            } else {
              acc[foundIdx].occurrences += 1;
            }
          });

          return acc;
        }, [])
        .sort((a, b) => b.occurrences - a.occurrences),
    [servers]
  );

  return (
    <>
      {visible && (
        <>
          <Spacer h={1} />

          <Card>
            <div className="grid grid-cols-4 gap-6 py-4 items-center">
              <div>
                <Input placeholder="Server name" clearable value={serverName} onChange={(e) => setServerName(e.target.value)} />
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
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div>
                <Select placeholder="Mods" value={serverMods} onChange={(value) => setServerMods(value as string[])} width="100%" multiple>
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
      )}
    </>
  );
};

export default ServerFilters;
