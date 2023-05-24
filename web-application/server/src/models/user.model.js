import Conversation from "./conversation.model.js";
import db from "../db.js";

/**
 * @class User
 */

class User {
  constructor(id, name = null, botOrder = null) {
    this.id = id;
    this.conversations = [];
    this.activeConversation = null;
    this.botOrder = botOrder;

    if (name !== null) {
      this.name = name;
    } else {
      this.loadUsernameFromDB();
    }

    this.loadConversations();
  }

  async loadUsernameFromDB() {
    const dbQuery = `SELECT * FROM users WHERE userId = ?`;
    const params = [this.id];

    await db.each(dbQuery, params, (err, row) => {
      if (err) {
        throw new Error(err);
      } else {
        this.name = row.username;
        this.botOrder = row.botOrder;
      }
    });
  }

  async loadConversations() {
    const query = `
            SELECT * FROM userConversations
            WHERE userId = ?
        `;
    const params = [this.id];

    await db.each(query, params, (err, row) => {
      if (err) {
        throw new Error(err);
      } else {
        let unanswered = false;
        if (row.unansweredMessage === 1) {
          unanswered = true;
        }

        this.conversations.push(
          new Conversation(
            row.conversationUUID,
            row.botVersion,
            row.messageTitle,
            undefined,
            unanswered
          )
        );
      }
    });
  }

  createConversation(conversationId, version) {
    const conversation = new Conversation(conversationId, version, null, true);
    this.conversations.push(conversation);
  }

  getConversations(version) {
    return this.conversations.filter(
      (conversation) => conversation.botVersion === version
    );
  }

  getConversation(conversationId) {
    return this.conversations.find(
      (conversation) => conversation.conversationId === conversationId
    );
  }

  clearEmptyConversations() {
    this.conversations = this.conversations.filter(
      (conversation) => conversation.messages.length > 1
    );
  }
}

export default User;
