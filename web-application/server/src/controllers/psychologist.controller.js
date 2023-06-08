import { Router } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import model from "../model.js";
import db from "../db.js";

const router = Router();

/**
 * requireAuth is a middleware function that limit access to an endpoint to authenticated users.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
const requirePsychologistAuth = (req, res, next) => {
  const { sessionId } = req.cookies;

  if (!model.isPsychologistAuthenticated(sessionId)) {
    res.status(401).end();
    return;
  }

  next();
};

router.post("/psychologist-signin", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  let query = `
    SELECT * FROM psychologists WHERE username = ?
  `;

  const row = await db.get(query, username);

  if (row !== undefined) {
    const match = await bcrypt.compare(password, row.password);
    if (match) {
      const sessionId = uuidv4();
      res.cookie("sessionId", sessionId);

      query = `
        INSERT INTO psychologistSessions (sessionUUID, userId)
        VALUES (?, ?)
      `;

      const params = [sessionId, row.userId];

      await db.run(query, params);

      model.addPsychologist(sessionId, row.userId, username);

      model.modelEmit("psychologistOnline");

      res.status(202).end();
    } else {
      res.status(401).end();
    }
  } else {
    res.status(401).end();
  }
});

router.post(
  "/psychologist-signout",
  requirePsychologistAuth,
  async (req, res) => {
    const { sessionId } = req.cookies;

    model.signOutPsychologist(sessionId);

    const query = `
    DELETE FROM psychologistSessions WHERE sessionUUID = ?
  `;
    const params = [sessionId];

    await db.run(query, params);

    res.clearCookie("sessionId");
    res.clearCookie("conversationId");

    res.status(200).end();
  }
);

router.post(
  "/load-psychologist-conversations",
  requirePsychologistAuth,
  async (req, res) => {
    const psychologistConversations =
      await model.getPsychologistConversations();

    const formatedMessages = psychologistConversations
      .filter((conversation) => conversation.title !== null)
      .map((conversation) => ({
        conversationId: conversation.conversationId,
        messageTitle: conversation.title,
        userName: model.getUserName(conversation.userId),
        unanswered: conversation.unansweredMessages,
      }));

    const conversationsGroupedByUser = {};

    for (let index = 0; index < formatedMessages.length; index += 1) {
      const conversation = formatedMessages[index];

      if (conversationsGroupedByUser[conversation.userName] === undefined) {
        conversationsGroupedByUser[conversation.userName] = [];
      }

      conversationsGroupedByUser[conversation.userName].push(conversation);
    }

    res.status(200).json(conversationsGroupedByUser);
  }
);

router.post(
  "/load-psycholigist-conversation",
  requirePsychologistAuth,
  async (req, res) => {
    const { conversationId } = req.body;

    const conversation = model.getConversationById(conversationId);

    if (conversation === null) {
      res.status(404).end();
      return;
    }
    const messages = conversation.getMessages();

    const formatedMessages = [];

    for (let index = 0; index < messages.length; index += 1) {
      formatedMessages.push({
        message: messages[index].message,
        sender: messages[index].sender,
        videoId: messages[index].videoId,
      });
    }

    res.status(200).json({ formatedMessages });
  }
);

router.post(
  "/send-psychologist-message",
  requirePsychologistAuth,
  async (req, res) => {
    const { message } = req.body;
    const { conversationId } = req.body;

    const conversation = model.getConversationById(conversationId);

    conversation.addMessage(message, "bot", null);

    let dbQuery = `
            INSERT INTO messages (messageId, sender, message, videoId, timestamp, conversationUUID)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

    const messageId = uuidv4();
    const timestamp = new Date().toJSON().slice(0, 19).replace("T", " ");

    let dbParams = [messageId, "bot", message, null, timestamp, conversationId];

    await db.run(dbQuery, dbParams);

    conversation.unansweredMessages = false;

    dbQuery = `
    UPDATE userConversations SET unansweredMessage = 0 WHERE conversationUUID = ?
  `;

    dbParams = [conversationId];

    await db.run(dbQuery, dbParams);

    model.modelEmit("newMessageFromBot");

    res.status(200).end();
  }
);

export default { router };
