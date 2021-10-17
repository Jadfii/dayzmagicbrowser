import { Card, Checkbox, Input, Select, Spacer } from '@geist-ui/react';
import React, { useContext, useMemo } from 'react';
import { ServerFiltersContext } from '../../contexts/ServerFiltersProvider';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { ServersContext } from '../../contexts/ServersProvider';

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  visible: boolean;
  handleClose?: () => void;
}

const ServerFilters: React.FC<Props> = ({ visible, handleClose }) => {
  const { servers } = useContext(ServersContext);
  const { getIslandByTerrain } = useContext(IslandsContext);
  const { setServerName, setServerIsland, setServerVersion, setIsFirstPersonOnly, setIsOfficial, setIsExperimental, setHasNoQueue } =
    useContext(ServerFiltersContext);

  const availableVersions: SelectOption[] = useMemo(
    () => [
      { label: 'None', value: '' },
      ...[...new Set(servers.reduce<string[]>((acc, curr) => [...acc, curr.version], []))]
        .sort()
        .reverse()
        .map((version) => ({ label: version, value: version })),
    ],
    [servers]
  );
  const availableIslands: SelectOption[] = useMemo(
    () => [
      { label: 'None', value: '' },
      ...servers.reduce<SelectOption[]>((acc, curr) => {
        const island = getIslandByTerrain(curr?.island);
        const option = { label: island?.name || curr?.island, value: island?.terrainId || curr?.island };

        if (!acc.find((o) => o.value === option.value)) {
          acc.push(option);
        }

        return acc;
      }, []),
    ],
    [servers, getIslandByTerrain]
  );

  function onClose() {
    if (handleClose) handleClose();
  }

  return (
    <>
      {visible && (
        <>
          <Spacer h={1} />

          <Card>
            <div className="grid grid-cols-4 gap-6 py-4 items-center">
              <div>
                <Input placeholder="Server name" clearable onChange={(e) => setServerName(e.target.value)} />
              </div>

              <div>
                <Select placeholder="Map" onChange={(value) => setServerIsland(value as string)}>
                  {availableIslands.map((option, i) => (
                    <Select.Option key={i} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div>
                <Select
                  placeholder="Version"
                  onChange={(value) => {
                    if (value === 'None') setServerVersion('');
                    else setServerVersion(value as string);
                  }}
                >
                  {availableVersions.map((option, i) => (
                    <Select.Option key={i} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div>
                <Checkbox scale={4 / 3} onChange={(e) => setIsFirstPersonOnly(e.target.checked)}>
                  First person only
                </Checkbox>
              </div>

              <div>
                <Checkbox scale={4 / 3} onChange={(e) => setIsOfficial(e.target.checked)}>
                  Official server
                </Checkbox>
              </div>

              <div>
                <Checkbox scale={4 / 3} onChange={(e) => setIsExperimental(e.target.checked)}>
                  Experimental server
                </Checkbox>
              </div>

              <div>
                <Checkbox scale={4 / 3} onChange={(e) => setHasNoQueue(e.target.checked)}>
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
