from flask import Flask, jsonify, request
from ChatGPT_full import getChatbotResponse as getFullResponse
from ChatGPT_short import getChatbotResponse as getShortResponse
from ChatGPT_content import getChatbotResponse as getContentResponse
from ChatGPT_intent import getChatbotResponse as getIntentResponse
import re
import openai
import os
import dotenv

dotenv.load_dotenv()

app = Flask(__name__)

@app.route('/chatbot', methods=['POST'])
def get_chatbot_response():
    data = request.get_json()

    messages = data['messages'] # format: [{'message': "Hi! I'm an AI Psychologist, how may I help you?", 'sender': 'bot'}, {'message': 'hi', 'sender': 'user'}]
    version = data['version'] #string with text 'Closed' or 'Open' or 'Mixed'

    response = getResponse(messages, version)
    title = getTitle(messages)

    return jsonify({'response': response, 'title': title})

def test_get_chatbot_response():
    messages = [{'message': 'I like Ice Cream.', 'sender': 'user'}]
    version = 'Intent'

    response = getResponse(messages, version)
    title = getTitle(messages)

    print(response)
    # print()
    # print(title)

def getResponse(messages, version):
    history = parseMessages(messages)

    if version == 'Closed':
        history.insert(0, {"role": "system", "content": "You are an AI psychologist. You are not chatGPT." +
            "Give short answers like you are having a verbal conversation. \n" +
            "You will be used as the language engine in a chatbot that can send media. \n" +
            "The media that is avallible is pdfs about Sleep, depression and meditation, mp3s about meditation and jpgs about meditation. \n" +
            "If you want to send the user some form of media, use the following format: $[mediatype, content]$." + 
            "The mediatype can be pdf, mp3 or jpg. The content can be Sleep, depression or meditation \n"})
        return addResources(getContentResponse(history))
    elif version == 'Open':
        history.insert(0, {"role": "system", "content": "You are an AI psychologist. You are not chatGPT. You specialize in CBT."})
        return getFullResponse(history)
    elif version == 'Mixed':
        history.insert(0, {"role": "system", "content": "You are an AI psychologist. You are not chatGPT. Give short answers like you are having a verbal conversation. You specialize in CBT."})
        return getShortResponse(history)
    elif version == 'Intent':
        return getIntentResponse(history)
    
def parseMessages(messages):
    history = []
    for message in messages:
        tmp  = {}
        if message['sender'] == 'bot':
            tmp['role'] = 'system'
        else:
            tmp['role'] = 'user'
        tmp['content'] = message['message']
        history.append(tmp)
    return history

def getTitle(history):
    openai.api_key = os.getenv("OPENAI_API_KEY")

    messages = [{"role": "system", "content": "Give a short (max 4 words) title the following conversation"}]
    messages.extend(parseMessages(history))
    title = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    ).choices[0].message.content

    if title == "\".*\"":
        title = title[1:-1]

    return title

def addResources(prompt):
    if re.search("\$\[.*\,.*\]\$", prompt):
        prompt = re.sub("\$\[.*\,.*\]\$", "THIS IS A FILE", prompt)
    return prompt

if __name__ == '__main__':
    app.run()
    # test_get_chatbot_response()