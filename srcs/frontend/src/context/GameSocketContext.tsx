'use client';
import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useUserContext } from './UserContext';

interface GameSocketContextType {
  move: (direction: string) => void;
  isConnected: boolean;
  myPaddel: Paddel;
  oppPaddel: Paddel;
  gameStarted: boolean;
  me: PlayerData;
  opp: PlayerData;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  ball: Ball;
  stageReady: boolean;
  setStage: React.Dispatch<React.SetStateAction<boolean>>;
  gameEnded: boolean;
  setGameEnded: React.Dispatch<React.SetStateAction<boolean>>;
  winner: PlayerData;
  room: string | null;
  setRoom: React.Dispatch<React.SetStateAction<string | null>>;
  disconnectSocket: () => void;
}

interface Paddel {
  x: number;
  y: number;
  score: number;
}

interface Ball {
  x: number;
  y: number;
}

interface PlayerData {
  id: number;
  username: string;
  avatar: string;
}

const GameSocketContext = createContext<GameSocketContextType | null>(null);

export const GameSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const [myPaddel, setMyPaddel] = useState<Paddel>({ x: 0, y: 0, score: 0 });
  const [oppPaddel, setOppPaddel] = useState<Paddel>({ x: 0, y: 0, score: 0 });
  const [ball, setBall] = useState<Ball>({ x: 0, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [stageReady, setStage] = useState(false);
  const opp = useRef<PlayerData>({ id: 0, username: '', avatar: '' });
  const winner = useRef<PlayerData>({ id: 0, username: '', avatar: '' });
  const [gameEnded, setGameEnded] = useState(false);
  const { userData } = useUserContext();
  const [room, setRoom] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageQueue = useRef<Array<() => void>>([]);
  const meRef = useRef<PlayerData>({ 
    id: userData.id, 
    username: userData.username, 
    avatar: userData.avatar_url 
  });

  const getOpponent = useCallback(() => {
    return opp.current;
  }, [ opp ]);
  useEffect(() => {
    meRef.current = {
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar_url
    };
  }, [userData]);

  const resetGameState = useCallback(() => {
    setMyPaddel({ x: 0, y: 0, score: 0 });
    setOppPaddel({ x: 0, y: 0, score: 0 });
    setBall({ x: 0, y: 0 });
    setStage(false);
    setGameEnded(false);
    winner.current = { id: 0, username: '', avatar: '' };
  }, []);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'room.waiting':
          if (data.data.is_invite_only) {
            opp.current = {
              id: data.data.opp.id,
              username: data.data.opp.username,
              avatar: data.data.opp.avatar,
            };
            console.log('opp:', opp.current);
          }
          break;
        case 'game.start':
          const op = data.data.participants.find(
            (p: { id: number }) => p.id !== meRef.current.id
          );
          opp.current = {
            id: op.id,
            username: op.username,
            avatar: op.avatar_url || '',
          };
          break;
        case 'game.update':
          setStage(true);
          setMyPaddel(prev => ({
            ...prev,
            x: data.data[meRef.current.id].x,
            y: data.data[meRef.current.id].y,
            score: data.data[meRef.current.id].score,
          }));
          setOppPaddel(prev => ({
            ...prev,
            x: data.data[opp.current.id].x,
            y: data.data[opp.current.id].y,
            score: data.data[opp.current.id].score,
          }));
          setBall({ x: data.data.ball.x, y: data.data.ball.y });
          break;
        case 'game.over':
          setGameEnded(true);
          winner.current = meRef.current.id === data.data.winner ? meRef.current : opp.current;
          // resetGameState();
          break;
        default:
          console.warn('Unhandled message type:', data);
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }, [resetGameState]);

  const connectWebSocket = useCallback(() => {
    if (ws.current && [WebSocket.OPEN, WebSocket.CONNECTING].includes(ws.current.readyState)) {
      return;
    }
    const wsBaseUlr = process.env.NEXT_PUBLIC_WS_URL;
    const wsUrl = room ? `${wsBaseUlr}/game/${room}/` : `${wsBaseUlr}/game/`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      messageQueue.current.forEach(send => send());
      messageQueue.current = [];
    };

    ws.current.onmessage = handleMessage;

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      disconnectSocket();
    };
  }, [room, handleMessage]);

  useEffect(() => {
    if (gameStarted) {
      connectWebSocket();
    }
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      setIsConnected(false);
    };
  }, [gameStarted, connectWebSocket]);

  const disconnectSocket = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setRoom(null);
    resetGameState();
    setGameStarted(false);
    setIsConnected(false);
  }, [resetGameState]);

  const move = useCallback((direction: string) => {
    const sendMove = () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ action: 'move', direction }));
      }
    };

    if (isConnected) {
      sendMove();
    } else {
      messageQueue.current.push(sendMove);
    }
  }, [isConnected]);

  const contextValue = useMemo(() => ({
    stageReady,
    setStage,
    gameStarted,
    setGameStarted,
    myPaddel,
    oppPaddel,
    me: meRef.current,
    opp: opp.current,
    move,
    ball,
    disconnectSocket,
    gameEnded,
    setGameEnded,
    winner: winner.current,
    room,
    setRoom,
    isConnected,
    getOpponent,
  }), [
    stageReady,
    gameStarted,
    myPaddel,
    oppPaddel,
    ball,
    gameEnded,
    room,
    isConnected,
    move,
    disconnectSocket,
    setStage,
    setGameStarted,
    setGameEnded,
    setRoom,
    getOpponent,
  ]);

  return (
    <GameSocketContext.Provider value={contextValue}>
      {children}
    </GameSocketContext.Provider>
  );
};

export const useGameSocket = () => {
  const context = useContext(GameSocketContext);
  if (!context) {
    throw new Error('useGameSocket must be used within a GameSocketProvider');
  }
  return context;
};