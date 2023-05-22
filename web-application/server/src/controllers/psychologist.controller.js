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
const requireAuth = (req, res, next) => {
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

      res.status(202).end();
    } else {
      res.status(401).end();
    }
  } else {
    res.status(401).end();
  }
});

router.post("/psychologist-signout", requireAuth, async (req, res) => {
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
});

router.post("/load-psychologist-conversations", requireAuth, async (req, res) => {
  const { sessionId } = req.cookies;

  const psychologistConversations = await model.getPsychologistConversations(sessionId);

  const formatedMessages = psychologistConversations.map(conversation => ({
    conversationId: conversation.conversationId,
    messageTitle: conversation.title,
    userName: model.getUserName(conversation.userId),
    unanswered: conversation.unansweredMessages,
  }));
  
  res.status(200).json(formatedMessages);
});

export default { router };
