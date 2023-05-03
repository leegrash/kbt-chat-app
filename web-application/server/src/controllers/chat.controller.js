import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import model from "../model.js";
import db from "../db.js";
import { requireAuth } from "./user.controller.js";

const router = Router();

router.post("/load-conversation", requireAuth, async (req, res) => {
  const { sessionId } = req.cookies;
  const { version } = req.body;

  const user = model.users.get(sessionId);

  const newConversationId = uuidv4();

  user.createConversation(newConversationId, version);

  const conversations = user.getConversations(version);

  const prevTitles = [];

  for (let index = 0; index < conversations.length; index += 1) {
    if (conversations[index].title !== null) {
      prevTitles.push({
        title: conversations[index].title,
        id: conversations[index].conversationId,
      });
    }
  }

  const messages = [
    {
      message: "Hi! I'm an AI Psychologist, how may I help you?",
      sender: "bot",
    },
  ];

  res.cookie("conversationId", newConversationId);
  res.json({ messages, prevTitles });

  res.status(200).end();
});

router.post("/send-message", requireAuth, async (req, res) => {
  const { sessionId } = req.cookies;
  const { conversationId } = req.cookies;
  const { message } = req.body;
  const { version } = req.body;

  try {
    const user = model.users.get(sessionId);

    const conversation = user.getConversation(conversationId);

    const messages = conversation.getMessages();

    conversation.addMessage(message, "user");

    const formatedMessages = [];

    for (let index = 0; index < messages.length; index += 1) {
      formatedMessages.push({
        message: messages[index].message,
        sender: messages[index].sender,
      });
    }

    // call python model with messages and version

    let modelResponse =
      "I'm sorry, I don't understand. Could you rephrase that?";

    /*
    fetch("http://localhost:5000/chatbot", {
      method: "POST",
      body: JSON.stringify({ messages, version }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        modelResponse = data.message;
      });*/

    const conversationTitle = "Test conversation";
    
    conversation.setTitle(conversationTitle);

    conversation.addMessage(modelResponse, "bot");

    formatedMessages.push({ message: modelResponse, sender: "bot" });

    let dbQuery = `
            SELECT EXISTS (SELECT * FROM userConversations where conversationUUID = ?)
        `;

    let params = [conversationId];

    const row = await db.get(dbQuery, params);

    if (
      row[
        "EXISTS (SELECT * FROM userConversations where conversationUUID = ?)"
      ] === 0
    ) {
      dbQuery = `
                INSERT INTO userConversations (conversationUUID, userId, botVersion, messageTitle)
                VALUES (?, ?, ?, ?)
            `;

      params = [conversationId, user.id, version, conversationTitle];

      await db.run(dbQuery, params);
    } else {
      dbQuery = `
                UPDATE userConversations
                SET messageTitle = ?
                WHERE conversationUUID = ?
            `;
      params = [conversationTitle, conversationId];
      await db.run(dbQuery, params);
    }

    const messageId = uuidv4();

    dbQuery = `
            INSERT INTO messages (messageId, message, timestamp, response, conversationUUID)
            VALUES (?, ?, ?, ?, ?)
        `;

    const date = new Date().toJSON().slice(0, 19).replace("T", " ");

    params = [messageId, message, date, modelResponse, conversationId];

    await db.run(dbQuery, params);

    res.json({ formatedMessages });
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
});

router.put("/clear-empty-conversations", requireAuth, async (req, res) => {
  const { sessionId } = req.cookies;

  const user = model.users.get(sessionId);

  try {
    user.clearEmptyConversations();
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
});

router.post("/load-prev-conversation", requireAuth, async (req, res) => {
  const { sessionId } = req.cookies;
  const { conversationId } = req.body;
  const { version } = req.body;

  const user = model.users.get(sessionId);

  const conversation = user.getConversation(conversationId);

  const messages = conversation.getMessages();

  const formatedMessages = [];

  for (let index = 0; index < messages.length; index += 1) {
    formatedMessages.push({
      message: messages[index].message,
      sender: messages[index].sender,
    });
  }

  const prevTitles = [];

  const conversations = user.getConversations(version);
  for (let index = 0; index < conversations.length; index += 1) {
    if (
      conversations[index].title !== null &&
      conversations[index].conversationId !== conversationId
    ) {
      prevTitles.push({
        title: conversations[index].title,
        id: conversations[index].conversationId,
      });
    }
  }

  res.cookie("conversationId", conversationId);
  res.json({ formatedMessages, prevTitles });
  res.status(200).end();
});

router.post("/new-conversation", requireAuth, async (req, res) => {
  const { sessionId } = req.cookies;
  const { version } = req.body;

  const user = model.users.get(sessionId);

  const newConversationId = uuidv4();

  user.createConversation(newConversationId, version);

  const conversations = user.getConversations(version);

  const prevTitles = [];

  for (let index = 0; index < conversations.length; index += 1) {
    if (conversations[index].title !== null) {
      prevTitles.push({
        title: conversations[index].title,
        id: conversations[index].conversationId,
      });
    }
  }

  const messages = [
    {
      message: "Hi! I'm an AI Psychologist, how may I help you?",
      sender: "bot",
    },
  ];

  res.cookie("conversationId", newConversationId);
  res.json({ messages, prevTitles });

  res.status(200).end();
});

export default { router };
