/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import ChatInput from "./ChatInput";

import phone from "@/assets/images/phone.png";
import call from "@/assets/images/call.png";
import down from "@/assets/images/down.png";
import account from "@/assets/images/account.png";

import "./ChatContainer.scss";
import { useChat } from "@/hooks/useChat";
import ConfirmDeleteMessage from "./ConfirmDeleteMessage";

const ChatContainer = ({ currentChat, currentUser }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { t } = useTranslation("messages");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const scrollRef = useRef();

  const {
    users,
    connectedUsers,
    messages,
    displayMessages,
    sendDirectMessage,
    deleteMessage,
    onLogout,
  } = useChat({ currentChat, currentUser });

  const handleClickViewProfile = () => {
    navigate(`/profile/${currentChat.id}`);
  };

  useEffect(() => {
    //cuộn xuống tin nhắn mới khi danh sách tin nhắn thay đổi
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCancelConfirmDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <div className="body-chatContainer">
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              style={{ cursor: "pointer" }}
              src={
                currentChat.avatarUrl !== ("string" && "")
                  ? currentChat.avatarUrl
                  : account
              }
              alt="avatar"
            />
          </div>
          <div className="username">
            <p style={{ cursor: "pointer" }}>
              <b>{currentChat.fullname}</b>
            </p>
          </div>
        </div>
        <div className="action">
          <img style={{ cursor: "pointer" }} src={phone} alt="phone" />
          <img style={{ cursor: "pointer" }} src={call} alt="call" />
          <img style={{ cursor: "pointer" }} src={down} alt="down" />
        </div>
      </div>
      <div className="chat-message">
        <div className="top-chat-message">
          <div className="infor">
            <div className="avatar">
              <img
                style={{ cursor: "pointer" }}
                src={
                  currentChat.avatarUrl !== ("string" && "")
                    ? currentChat.avatarUrl
                    : account
                }
                alt="avatar"
              />
            </div>
            <div className="username">
              <p style={{ cursor: "pointer" }}>
                <b>{currentChat.fullname}</b>
              </p>
            </div>
            <button
              style={{ cursor: "pointer" }}
              className="btn-viewProfile"
              onClick={handleClickViewProfile}
            >
              <b>{t("viewProfile")}</b>
            </button>
          </div>
        </div>

        <div className="message">
          {displayMessages.length > 0 &&
            displayMessages.map((msg, index) => (
              <div className="chat" key={index} ref={scrollRef}>
                <div className={`message-item ${msg.type}`}>
                  <div className="avatar">
                    <img
                      style={{ cursor: "pointer" }}
                      src={
                        msg.type === "sent"
                          ? currentUser.avatarUrl !== ("string" && "")
                            ? currentUser.avatarUrl
                            : account
                          : currentChat.avatarUrl !== ("string" && "")
                          ? currentChat.avatarUrl
                          : account
                      }
                      alt="avatar"
                    />
                  </div>
                  {currentUser.id === msg.sender && (
                    <button
                      style={{ cursor: "pointer" }}
                      // onClick={() =>
                      //   deleteMessage(
                      //     msg,
                      //     msg.type === "sent" ? "Sender" : "Receiver",
                      //     msg.type === "sent"
                      //   )
                      // }
                      onClick={() => setShowConfirmDelete(true)}
                      className="delete-message"
                    >
                      🗑
                    </button>
                  )}

                  <div
                    className={`message-content ${
                      (msg.isSenderDeleted === true &&
                        currentUser.id === msg.sender) ||
                      (msg.isReceiverDeleted === true &&
                        currentUser.id === msg.receiver)
                        ? "recalled"
                        : ""
                    }`}
                  >
                    <p>
                      {
                      (msg.isSenderDeleted === true &&
                        currentUser.id === msg.sender) ||
                      (msg.isReceiverDeleted === true &&
                        currentUser.id === msg.receiver)
                        ? t("recalled")
                        : msg.content}
                    </p>
                    <p className="hours">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {showConfirmDelete && (
                  <div className="overlay" onClick={handleCancelConfirmDelete}>
                    <motion.div
                      className="item-explore-container"
                      onClick={(e) => e.stopPropagation()}
                      animate={{ opacity: 1, scale: 1 }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ConfirmDeleteMessage
                        onCancel={handleCancelConfirmDelete}
                        message={msg}
                        deleteMessage={deleteMessage}
                      />
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      <ChatInput handleSendMsg={sendDirectMessage} />
    </div>
  );
};

export default ChatContainer;
