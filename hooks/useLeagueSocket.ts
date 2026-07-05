import { useEffect, useRef } from 'react';

const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;
const MALFORMED_MESSAGE_LOG_LIMIT = 200;

type UpdateMessage = {
  type: string,
};

function isUpdateMessage(data: unknown): data is UpdateMessage {
  return typeof data === 'object' && data !== null && (data as UpdateMessage).type === 'updated';
}

/**
 * Opens a WebSocket connection to the realtime Worker for the given league and
 * invokes `onUpdate` whenever the Worker signals that the league data changed
 * (and once immediately on every connect/reconnect, to recover any update
 * missed while disconnected).
 */
export default function useLeagueSocket(leagueName: string, onUpdate: () => void): void {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!wsBaseUrl) {
      // eslint-disable-next-line no-console
      console.warn('useLeagueSocket: NEXT_PUBLIC_WS_URL is not set — skipping WS connection');
      return undefined;
    }

    let socket: WebSocket | undefined;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let backoffMs = INITIAL_BACKOFF_MS;
    let stopped = false;

    const scheduleReconnect = () => {
      if (stopped) return;

      reconnectTimer = setTimeout(() => {
        backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
        connect();
      }, backoffMs);
    };

    function connect() {
      const url = `${wsBaseUrl}/ws/${encodeURIComponent(leagueName)}`;
      socket = new WebSocket(url);

      socket.onopen = () => {
        backoffMs = INITIAL_BACKOFF_MS;
        onUpdateRef.current();
      };

      socket.onmessage = (event: MessageEvent) => {
        try {
          const parsed: unknown = JSON.parse(event.data);
          if (isUpdateMessage(parsed)) onUpdateRef.current();
        } catch (error: unknown) {
          const rawPreview = String(event.data).slice(0, MALFORMED_MESSAGE_LOG_LIMIT);
          const reason = error instanceof Error ? error.message : String(error);
          // eslint-disable-next-line no-console
          console.warn(`useLeagueSocket: received malformed WS message, ignoring (${reason}). Preview: ${rawPreview}`);
        }
      };

      socket.onclose = () => {
        if (!stopped) scheduleReconnect();
      };

      socket.onerror = () => {
        socket?.close();
      };
    }

    connect();

    return () => {
      stopped = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.close();
      }
    };
  }, [leagueName]);
}
