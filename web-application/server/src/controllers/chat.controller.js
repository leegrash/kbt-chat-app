import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import http from "http";
import model from "../model.js";
import db from "../db.js";
import { requireAuth } from "./user.controller.js";

const router = Router();

async function botChat(sessionId, conversationId, message, version) {
  const userMessageTS = new Date().toJSON().slice(0, 19).replace("T", " ");
  const user = model.users.get(sessionId);

  const conversation = user.getConversation(conversationId);

  const messages = conversation.getMessages();

  conversation.addMessage(message, "user");

  const formatedMessages = [];

  for (let index = 0; index < messages.length; index += 1) {
    formatedMessages.push({
      message: messages[index].message,
      sender: messages[index].sender,
      videoId: messages[index].videoId,
    });
  }

  const data = JSON.stringify({
    messages,
    version,
  });

  const options = {
    hostname: "127.0.0.1",
    port: 5000,
    path: "/chatbot",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(data, "utf8"),
    },
  };

  const sendHttpRequest = (modelOptions, modelData) =>
    new Promise((resolve, reject) => {
      const modelReq = http.request(modelOptions, (modelRes) => {
        let responseData = "";
        modelRes.on("data", (chunk) => {
          responseData += chunk;
        });
        modelRes.on("end", () => {
          const { statusCode } = modelRes;
          if (statusCode >= 200 && statusCode < 300) {
            resolve(responseData);
          } else {
            reject(new Error(`Request failed with status code ${statusCode}`));
          }
        });
      });

      modelReq.on("error", (error) => {
        reject(error);
      });

      modelReq.write(modelData);
      modelReq.end();
    });

  let modelResponse =
    "The bot is not available at the moment. Please try again later.";
  let conversationTitle = null;
  let videoId = null;

  let apiRequestSuccess = false;

  try {
    const modelReqPromise = sendHttpRequest(options, data);
    const modelRes = await modelReqPromise;

    const responseData = JSON.parse(modelRes);

    modelResponse = responseData.response;
    conversationTitle = responseData.title;
    if (responseData.videoId !== "None") {
      videoId = responseData.videoId;
    }
    apiRequestSuccess = true;
  } catch (error) {
    if (error.response && error.response.statusCode === 500) {
      modelResponse =
        "We're currently experiencing high demand. Please try again later.";
    }
    console.error("Model API not available");
  }

  if (apiRequestSuccess) {
    conversation.setTitle(conversationTitle);

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
            INSERT INTO messages (messageId, sender, message, videoId, timestamp, conversationUUID)
            VALUES (?, ?, ?, ?, ?, ?)
    `;
    params = [messageId, "user", message, null, userMessageTS, conversationId];

    await db.run(dbQuery, params);

    dbQuery = `
            INSERT INTO messages (messageId, sender, message, videoId, timestamp, conversationUUID)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

    const responseTS = new Date().toJSON().slice(0, 19).replace("T", " ");

    const responseId = uuidv4();
    params = [
      responseId,
      "bot",
      modelResponse,
      videoId,
      responseTS,
      conversationId,
    ];

    await db.run(dbQuery, params);
  }

  conversation.addMessage(modelResponse, "bot", videoId);

  formatedMessages.push({ message: modelResponse, sender: "bot", videoId });

  return formatedMessages;
}

async function psychologistChat(
  sessionId,
  conversationId,
  newMessage,
  version
) {
  const userMessageTS = new Date().toJSON().slice(0, 19).replace("T", " ");

  const user = model.users.get(sessionId);
  const conversation = user.getConversation(conversationId);

  conversation.addMessage(newMessage, "user");

  const msgHistory = conversation.getMessages();

  const data = JSON.stringify({
    messages: msgHistory,
  });

  const options = {
    hostname: "127.0.0.1",
    port: 5000,
    path: "/get-title",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(data, "utf8"),
    },
  };

  const sendHttpRequest = (modelOptions, modelData) =>
    new Promise((resolve, reject) => {
      const modelReq = http.request(modelOptions, (modelRes) => {
        let responseData = "";
        modelRes.on("data", (chunk) => {
          responseData += chunk;
        });
        modelRes.on("end", () => {
          const { statusCode } = modelRes;
          if (statusCode >= 200 && statusCode < 300) {
            resolve(responseData);
          } else {
            reject(new Error(`Request failed with status code ${statusCode}`));
          }
        });
      });

      modelReq.on("error", (error) => {
        reject(error);
      });

      modelReq.write(modelData);
      modelReq.end();
    });

  let apiRequestSuccess = false;

  let conversationTitle = null;

  try {
    const modelReqPromise = sendHttpRequest(options, data);
    const modelRes = await modelReqPromise;

    const responseData = JSON.parse(modelRes);

    conversationTitle = responseData.title;

    apiRequestSuccess = true;
  } catch (error) {
    console.error("Model API not available");
  }

  if (apiRequestSuccess) {
    conversation.setTitle(conversationTitle);
  }

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
          INSERT INTO messages (messageId, sender, message, videoId, timestamp, conversationUUID)
          VALUES (?, ?, ?, ?, ?, ?)
  `;
  params = [messageId, "user", newMessage, null, userMessageTS, conversationId];

  await db.run(dbQuery, params);

  dbQuery = `
        UPDATE userConversations
        SET unansweredMessage = 1
        WHERE conversationUUID = ?
    `;
  params = [conversationId];

  await db.run(dbQuery, params);

  conversation.unansweredMessages = true;

  model.modelEmit("psychologistConversationsUpdate");

  model.modelEmit("newMessageFromUser");

  const messages = conversation.getMessages();

  const formatedMessages = [];

  for (let index = 0; index < messages.length; index += 1) {
    const { sender, videoId } = messages[index];
    const message = messages[index].message.replace(/(?:\r\n|\r|\n)/g, "<br>");
    formatedMessages.push({ message, sender, videoId });
  }

  return formatedMessages;
}

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
      videoId: null,
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

  if (version !== "psychologist") {
    try {
      const formatedMessages = await botChat(
        sessionId,
        conversationId,
        message,
        version
      );

      res.json({ formatedMessages });
      res.status(200).end();
    } catch (error) {
      res.status(500).end();
    }
  } else {
    try {
      const formatedMessages = await psychologistChat(
        sessionId,
        conversationId,
        message,
        version
      );

      res.json({ formatedMessages });
      res.status(200).end();
    } catch (error) {
      res.status(500).end();
    }
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

  let messages = [];
  if (conversation !== undefined) {
    messages = conversation.getMessages();
  } else {
    user.createConversation(conversationId, version);
    messages = user.getConversation(conversationId).getMessages();
  }

  const formatedMessages = [];

  for (let index = 0; index < messages.length; index += 1) {
    formatedMessages.push({
      message: messages[index].message,
      sender: messages[index].sender,
      videoId: messages[index].videoId,
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
      videoId: null,
    },
  ];

  res.cookie("conversationId", newConversationId);
  res.json({ messages, prevTitles });

  res.status(200).end();
});

router.post("/reload-conversation", requireAuth, async (req, res) => {
  const { conversationId } = req.cookies;

  const conversation = model.getConversationById(conversationId);

  const messages = conversation.getMessages();

  const formatedMessages = [];

  for (let index = 0; index < messages.length; index += 1) {
    formatedMessages.push({
      message: messages[index].message,
      sender: messages[index].sender,
      videoId: messages[index].videoId,
    });
  }

  res.json({ formatedMessages });
  res.status(200).end();
});

export default { router };
