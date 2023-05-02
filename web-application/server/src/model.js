import User from './models/user.model.js';

class Model {
  constructor() {
    this.authCookies = [];

    this.users = new Map();

    this.io = undefined;
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

  addUser(sessionId, userId, username, conversationId) {
    this.users.set(sessionId, new User(userId, username, conversationId));
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
}

export default new Model();
