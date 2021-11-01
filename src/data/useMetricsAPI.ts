import { get } from '../services/HTTP';
import { MetricResponse } from '../types/ResponseTypes';
import { Metric } from '../types/Types';
import { mapMetricResponse } from './Mapper';

const useMetricsAPI = () => {
  async function getMetrics(serverIp: string, serverPort: number, startDate?: Date, endDate?: Date): Promise<Metric[]> {
    try {
      const res: MetricResponse[] = await get(`metrics/${serverIp}/${serverPort}`, {
        ...(startDate ? { start: startDate.getTime() } : {}),
        ...(endDate ? { end: endDate.getTime() } : {}),
      });

      return res.map((metric) => mapMetricResponse(metric));
    } catch (e) {
      console.error('Failed to get metrics.', e);
      return [];
    }
  }

  return { getMetrics };
};

export default useMetricsAPI;
