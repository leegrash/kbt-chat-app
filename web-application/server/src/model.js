import User from './models/user.model.js';

class Model {
  constructor() {
    this.authCoookies = [];

    this.users = [];

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
    this.authCoookies.push(authCookie);
  }

  addUser(userId, username, conversationId) {
    this.users.push(new User(userId, username, conversationId));
  }

  authCookieExists(authCookie) {
    return this.authCoookies.includes(authCookie);
  }
}

export default new Model();
