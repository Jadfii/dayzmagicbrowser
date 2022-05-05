import { useToasts } from '@geist-ui/core';
import { openSteamConnect } from '../services/Steam';
import { Server } from '../types/Types';

export default function useConnectServer(server?: Server) {
  const { setToast } = useToasts();

  const connectToServer = () => {
    if (!server?.ipAddress || !server?.queryPort) return;

    const success = openSteamConnect(server?.ipAddress, server?.queryPort);

    if (success) {
      setToast({
        text: `Opening DayZ launcher for server ${server.name}`,
        type: 'success',
        delay: 5000,
      });
    }

    return success;
  };

  return {
    connectToServer,
  };
}
