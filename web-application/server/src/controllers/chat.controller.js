import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import model from "../model.js";
import db from "../db.js";
import { requireAuth } from "./user.controller.js";

const router = Router();

router.post("/load-conversation", requireAuth, async (req, res) => {
    const { sessionId } = req.cookies;
    const { version } = req.body;

    const user = model.users.get(sessionId);

    const newConversationId = uuidv4();

    user.createConversation(newConversationId, version);

    const conversations = user.getConversations(version);

    const prevTitles = [];

    for (let index = 0; index < conversations.length; index+=1) {
        if (conversations[index].title !== null) {
            prevTitles.push({"title": conversations[index].title, "id": conversations[index].id});
        }
    }

    const messages = [{"message": "Hi! I'm an AI Psychologist, how may I help you?", "sender": "bot"}];

    res.cookie("conversationId", newConversationId);
    res.json({ messages, prevTitles });

    res.status(200).end();
});

export default { router };
