import React from "react";
import socketio  from "socket.io-client";

export const socket = socketio("http://localhost:4001");

export const SocketContext = React.createContext();