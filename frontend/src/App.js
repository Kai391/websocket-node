import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { SocketContext } from "./context/socket";
const ENDPOINT = "http://localhost:4001";

export default function ClientComponent({ ID }) {
  const socket = useContext(SocketContext);
  const count = useRef(0);
  const [userId, setUserId] = useState();
  const [msg, setMsg] = useState({});
  const [sendMsg, setSendMsg] = useState(() => ({}));

  useEffect(() => {
    if (!count.current++) {
      // const socket = socketIOClient(ENDPOINT);
      socket.emit('ID', ID);
      socket.on('userId', data => {
        setUserId((da) => ({
          ...da,
          data
        }))
      })
      socket.on('msg-client', data => {
        console.log("msg", data);
        setMsg((d) => ({
          ...d,
          ...data
        }));
      })
    }
  }, [])

  // useEffect(()=>{
  //   console.log("msg",msg);
  // },[msg])

  const handleSend = (id) => {
    socket.emit('msg-server', { [id]: sendMsg[id] });
    setSendMsg((data) => ({ ...data, [id]: '' }))
  }

  return (
    <>
      {
        Object.keys(userId).map((id, index) => (
          <div key={index} style={{ display: "flex", alignItems: 'center', marginLeft: 5 }}>
            <span>{userId[id]}:</span> <input onChange={
              (e) => {
                setSendMsg(data => ({ ...data, [id]: e.target.value }))
              }} style={{ marginLeft: 10 }} value={sendMsg[id] ? sendMsg[id] : ''} placeholder={`write message for user`} />
            <button onClick={() => { handleSend(id) }}>Send</button>
            <p style={{ marginLeft: 10 }}>{msg[id]}</p>
          </div>
        ))
      }
    </>
  );
}