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

  addUser(sessionId, userId, username) {
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

  getConversations(sessionId, version) {
    const user = this.users.get(sessionId);

    return user.getConversations(version);
  }
}

export default new Model();
