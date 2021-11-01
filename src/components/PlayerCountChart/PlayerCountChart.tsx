import { useTheme } from '@geist-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { XYPlot, XAxis, YAxis, LineMarkSeries, AreaSeries, Hint } from 'react-vis';
import dayjs from 'dayjs';
import useMetricsAPI from '../../data/useMetricsAPI';
import { Metric, Server } from '../../types/Types';

const getHexOpacity = (hex: string, alpha: number) =>
  `${hex}${Math.floor(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`;

interface Datum {
  x: string | number | Date;
  y: string | number | Date;
  z?: string | number | Date;
  size?: string | number;
}

interface Props {
  server: Server | undefined;
  height?: number;
}

const PlayerCountChart: React.FC<Props> = ({ server, height = 400 }) => {
  const theme = useTheme();
  const { getMetrics } = useMetricsAPI();
  const [data, setData] = useState<Metric[]>([]);
  const [tooltipValue, setTooltipValue] = useState<Datum | undefined>(undefined);

  const chartData = useMemo(() => data.map((d) => ({ x: d.timestamp.getTime(), y: d.players, z: d.queue })), [data]);

  function onValueMouseOver(value: Datum) {
    setTooltipValue(value);
  }

  useEffect(() => {
    if (!server?.ip) return;

    (async () => {
      setData(await getMetrics(server.ip, server.queryPort, dayjs().subtract(1, 'hour').toDate(), new Date()));
    })();
  }, [server]);

  return (
    <>
      <XYPlot xType="time" width={800} height={height}>
        <XAxis tickTotal={10} />
        <YAxis />
        <LineMarkSeries
          onValueMouseOver={onValueMouseOver}
          onValueMouseOut={() => setTooltipValue(undefined)}
          stroke={theme.palette.success}
          fill={theme.palette.success}
          data={chartData}
        />
        <AreaSeries fill={getHexOpacity(theme.palette.success, 1 / 3)} stroke={'none'} data={chartData} />

        {tooltipValue && (
          <Hint
            format={(datum: Datum) => [
              { title: 'Time', value: new Date(datum.x).toLocaleString() },
              { title: 'Player count', value: `${datum.y}` + (datum.z ? ` (+${datum.z})` : '') },
            ]}
            value={tooltipValue}
          />
        )}
      </XYPlot>
    </>
  );
};

export default PlayerCountChart;
