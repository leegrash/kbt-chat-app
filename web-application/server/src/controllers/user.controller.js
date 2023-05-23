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
  // Use an unique session identifier to access information about the user making the request
  const { sessionId } = req.cookies;

  if (sessionId === undefined) {
    // Choose the appropriate HTTP response status code and send an HTTP response, if any, back to the client
    res.status(401).end();
    return;
  }

  if (!model.authCookieExists(sessionId)) {
    res.status(401).end();
    return;
  }

  next();
};

router.post("/signup", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  if (password.length < 5 || !/\d/.test(password)) {
    res.status(400).end();
    return;
  }

  const userExistPromise = await new Promise((resolve, reject) => {
    (async () => {
      try {
        await db.each(
          `SELECT * FROM users WHERE username = ?`,
          username,
          (err, row) => {
            if (err) {
              reject();
              throw new Error(err);
            } else if (row !== undefined) {
              res.status(400).end();
              resolve(true);
            } else {
              resolve(false);
            }
          }
        );
        resolve(false);
      } catch (error) {
        reject(error);
      }
    })();
  });

  const saltRounds = 10;

  let hashedPassword = "";
  const query = `
    INSERT INTO users (userId, username, password)
    SELECT ?, ?, ?
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = ?)
  `;

  if (!userExistPromise) {
    try {
      hashedPassword = await bcrypt.hash(password, saltRounds);
      const userId = uuidv4();
      const params = [userId, username, hashedPassword, username];
      await db.run(query, params);
      res.status(201).end();
    } catch (error) {
      console.error(error);
      res.status(400).end();
    }
  }
});

router.post("/signin", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  let query = `
    SELECT * FROM users WHERE username = ?
  `;

  const row = await db.get(query, username);

  if (row !== undefined) {
    const match = await bcrypt.compare(password, row.password);
    if (match) {
      const sessionId = uuidv4();
      model.addAuthCookie(sessionId);
      res.cookie("sessionId", sessionId);

      query = `
        INSERT INTO activeSessions (sessionUUID, userId)
        VALUES (?, ?)
      `;

      const params = [sessionId, row.userId];

      await db.run(query, params);

      model.addUser(sessionId, row.userId, row.username);

      model.modelEmit("psychologistConversationsUpdate");

      res.status(202).end();
    } else {
      res.status(401).end();
    }
  } else {
    res.status(401).end();
  }
});

router.post("/signout", requireAuth, async (req, res) => {
  const { sessionId } = req.cookies;

  model.signOutUser(sessionId);

  model.modelEmit("psychologistConversationsUpdate");

  const query = `
    DELETE FROM activeSessions WHERE sessionUUID = ?
  `;
  const params = [sessionId];

  await db.run(query, params);

  res.clearCookie("sessionId");
  res.clearCookie("conversationId");

  res.status(200).end();
});

export { router, requireAuth };
