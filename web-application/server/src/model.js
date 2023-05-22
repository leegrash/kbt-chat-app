import User from "./models/user.model.js";
import Psychologist from "./models/psychologist.model.js";

class Model {
  constructor() {
    this.authCookies = [];

    this.users = new Map();

    this.io = undefined;

    this.psychologists = new Map();

    this.psychologistCookies = [];

    this.psychologistOnline = false;
  }

  /**
   * Initialize the model after its creation.
   * @param {SocketIO.Server} io - The socket.io server instance.
   * @returns {void}
   */
  init(io) {
    this.io = io;
  }

  addAuthCookie(authCookie) {
    this.authCookies.push(authCookie);
  }

  addUser(sessionId, userId, username = null) {
    this.users.set(sessionId, new User(userId, username));
  }

  authCookieExists(authCookie) {
    return this.authCookies.includes(authCookie);
  }

  signOutUser(userSessionId) {
    this.users.delete(userSessionId);

    this.authCookies = this.authCookies.filter(
      (authCookie) => authCookie !== userSessionId
    );
  }

  addPsychologist(psychologistCookie, userId, username) {
    this.psychologistCookies.push(psychologistCookie);

    this.psychologists.set(psychologistCookie, new Psychologist(userId, username));

    this.psychologistOnline = true;
  }

  signOutPsychologist(psychologistCookie) {
    this.psychologists.delete(psychologistCookie);
    this.psychologistCookies = this.psychologistCookies.filter(
      (cookie) => cookie !== psychologistCookie
    );

    if (this.psychologistCookies.length === 0) {
      this.psychologistOnline = false;
    }
  }

  getConversations(sessionId, version) {
    const user = this.users.get(sessionId);

    return user.getConversations(version);
  }
}

export default new Model();
