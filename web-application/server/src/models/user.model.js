import Conversation from './conversation.model.js';
import db from "../db.js";

/**
 * @class User
 */

class User {
    constructor(id, name, conversationId) {
        this.id = id;
        this.name = name;
        this.conversations = [];
        this.activeConversation = conversationId;

        this.loadConversations();

        this.conversations.push(new Conversation(conversationId));
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
                this.conversations.push(new Conversation(row.conversationId, row.botVersion, row.messageTitle));
            }
        });
    }
}

export default User;
