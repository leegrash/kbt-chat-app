import { Router } from "express";
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
  const { authCookie } = req.cookies;

  if (authCookie === undefined) {
    // Choose the appropriate HTTP response status code and send an HTTP response, if any, back to the client
    res.status(401).end();
    return;
  }

  if (!model.authCookieExists(authCookie)) {
    res.status(401).end();
    return;
  }

  next();
};

router.post("/signup", (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  if (password.length < 5 || !/\d/.test(this.password)) {
    res.status(400).end();
    return;
  }

  // check if username already exists otherwise create new user with hashed password

  res.status(200).end();
});

export { router, requireAuth };
