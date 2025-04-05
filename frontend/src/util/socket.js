import {io} from 'socket.io-client';

export const socket = io(`${import.meta.env.BACKEND_BASEURL}`, {
    autoConnect: true, 
    reconnection: true,
  });