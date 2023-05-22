import Message from "./message.model.js";
import db from "../db.js";

/**
 * @class Conversation
 */

class Conversation {
  constructor(
    conversationId,
    botVersion,
    title = null,
    newConversation = false,
    unanswered = false
  ) {
    this.conversationId = conversationId;

    this.messages = [];

    if (newConversation === false) {
      this.messages.push(
        new Message("Hi! I'm an AI Psychologist, how may I help you?", "bot")
      );
      this.loadConversation();
    } else {
      this.messages.push(
        new Message("Hi! I'm an AI Psychologist, how may I help you?", "bot")
      );
    }
    this.botVersion = botVersion;
    this.title = title;
    this.unansweredMessages = unanswered;
  }

  async loadConversation() {
    const query = `
            SELECT * FROM messages
            WHERE conversationUUID = ?
            ORDER BY timestamp ASC
        `;

    await db.each(query, this.conversationId, (err, row) => {
      if (err) {
        throw new Error(err);
      } else {
        this.messages.push(new Message(row.message, row.sender, row.videoId));
      }
    });
  }

  getMessages() {
    return this.messages;
  }

  addMessage(message, sender, videoId = null) {
    this.messages.push(new Message(message, sender, videoId));
  }

  setTitle(title) {
    this.title = title;
  }
}

export default Conversation;
