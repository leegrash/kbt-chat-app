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

  getUserName(userId) {
    const corrUser = Array.from(this.users.values()).find(
      (user) => user.id === userId
    );
    return corrUser.name;
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

    this.psychologists.set(
      psychologistCookie,
      new Psychologist(userId, username)
    );

    this.psychologistOnline = true;
  }

  signOutPsychologist(psychologistCookie) {
    this.psychologists.delete(psychologistCookie);
    this.psychologistCookies = this.psychologistCookies.filter(
      (cookie) => cookie !== psychologistCookie
    );

    if (this.psychologistCookies.length === 0) {
      this.psychologistOnline = false;

      this.io.emit("psychologistOffline");
    }
  }

  isPsychologistOnline() {
    return this.psychologistOnline;
  }

  isPsychologistAuthenticated(sessionId) {
    return this.psychologistCookies.includes(sessionId);
  }

  getPsychologistConversations() {
    const psychologistConversations = [];
    const loadedUsrs = [];

    this.users.forEach((user) => {
      if (!loadedUsrs.includes(user.id)) {
        const conversations = user.getConversations("psychologist");
        conversations
          .filter((conversation) => conversation.botVersion === "psychologist")
          .filter((conversation) => conversation.messages.length > 1)
          .forEach((conversation) => {
            psychologistConversations.push({
              conversationId: conversation.conversationId,
              userId: user.id,
              title: conversation.title,
              unansweredMessages: conversation.unansweredMessages,
            });
          });
        loadedUsrs.push(user.id);
      }
    });

    return psychologistConversations;
  }

  getConversations(sessionId, version) {
    const user = this.users.get(sessionId);

    return user.getConversations(version);
  }

  getConversationById(conversationId) {
    let conversation = null;

    const allUsers = Array.from(this.users.values());

    allUsers.forEach((user) => {
      const corrConversation = user.getConversation(conversationId);
      if (corrConversation) {
        conversation = corrConversation;
      }
    });

    return conversation;
  }

  modelEmit(event) {
    this.io.emit(event);
  }
}

export default new Model();
