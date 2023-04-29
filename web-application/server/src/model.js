class Model {
  constructor() {
    this.authCoookies = [];

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
}

export default new Model();
