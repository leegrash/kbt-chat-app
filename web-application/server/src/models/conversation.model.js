import Message from "./message.model.js";
import db from "../db.js";

/**
 * @class Conversation
 */

class Conversation {
    constructor(conversationId, newConversation = false, botVersion, title) {
        this.conversationId = conversationId;

        if (newConversation === false) {
            this.messages = this.loadConversation();
        } else {
            this.messages.push(new Message("Hi! I'm an AI Psychologist, how may I help you?", "bot"));
        }
        this.botVersion = botVersion;
        this.title = title;
    }

    async loadConversation() {
        const query = `
            SELECT * FROM messages
            WHERE conversationUUID = ?
            ORDER BY timestamp DESC
        `;

        await db.each(query, this.conversationId, (err, row) => {
            if (err) {
                throw new Error(err);
            } else {
                this.messages.push(new Message(row.message, "user"));
                this.messages.push(new Message(row.message, "bot"));
            }
        });
    }
}

export default Conversation;
