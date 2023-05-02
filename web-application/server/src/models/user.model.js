import Conversation from './conversation.model.js';
import db from "../db.js";

/**
 * @class User
 */

class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.conversations = [];
        this.activeConversation = null;

        this.loadConversations();
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

    createConversation(conversationId, version) {
        const conversation = new Conversation(conversationId, version, null, true);
        this.conversations.push(conversation);
    }

    getConversations(version) {
        return this.conversations.filter((conversation) => conversation.botVersion === version);
    }

    getConversation(conversationId) {
        return this.conversations.find((conversation) => conversation.conversationId === conversationId);
    }
}

export default User;
