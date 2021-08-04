import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import useSound from "use-sound";
import { v4 as uuidv4 } from "uuid";
import config from "../../../config";
import LatestMessagesContext from "../../../contexts/LatestMessages/LatestMessages";
import TypingMessage from "./TypingMessage";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";
import "../styles/_messages.scss";

const socket = io(config.BOT_SERVER_ENDPOINT, {
  transports: ["websocket", "polling", "flashsocket"],
});

function Messages() {
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const { setLatestMessage, messages } = useContext(LatestMessagesContext);
  const [messageList, setMessageList] = useState([
    { id: "initialMessage", user: "bot", message: messages["bot"] },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [botAnswer, setBotAnswer] = useState("");

  const lastMessage = messageList[messageList.length - 1];
  const lastMessageRef = useRef(null);

  const scrollToLatestMessage = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToLatestMessage();
  }, [messageList]);

  socket.on("bot-message", (message) => {
    setBotAnswer(message);
    setBotTyping(false);
  });

  useEffect(() => {
    if (botAnswer !== "") {
      const botMessage = {
        user: "bot",
        id: `bot-${uuidv4()}`,
        message: botAnswer,
      };

      setLatestMessage("bot", botMessage?.message);
      setMessageList((messageList) => [...messageList, botMessage]);
      playReceive();
    }
  }, [botAnswer, playReceive, setLatestMessage]);

  socket.on("bot-typing", () => {
    setBotTyping(true);
  });

  const sendMessage = () => {
    socket.emit("user-message", newMessage?.message);
    setMessageList((messageList) => [...messageList, newMessage]);

    setLatestMessage("me", newMessage);

    playSend();
    setNewMessage("");
  };

  const onChangeMessage = (event) => {
    const message = {
      id: uuidv4(),
      user: "me",
      message: event.target.value,
    };

    setNewMessage(message);
  };

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        {messageList.map((message) => (
          <Message
            key={message.id}
            nextMessage={message.id !== lastMessage.id}
            message={message}
            botTyping={botTyping}
          />
        ))}
        {botTyping && <TypingMessage />}
        <div ref={lastMessageRef} />
      </div>
      <Footer
        message={newMessage.message || ""}
        sendMessage={sendMessage}
        onChangeMessage={onChangeMessage}
      />
    </div>
  );
}

export default Messages;
