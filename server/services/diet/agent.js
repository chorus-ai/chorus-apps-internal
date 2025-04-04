const db = require("../../models");
const { Op, Sequelize } = require("sequelize");

exports.agent = async (messages) => {
  // TODO: Implement the agent logic

  const newMessage = {
    message: "Hello, I am the agent",
    image: "",
    audio: "",
    user: "system",
    type: "message",
    createdAt: new Date(),
  };

  const newMessages = [...messages, newMessage];

  
  return newMessages;
};