from flask import Flask, jsonify, request
from gpt_api import getChatbotResponse as getGPTResponse
from resources import add_resource
from youtube import search_youtube
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

    [response, youtubeId] = getResponse(messages, version)
    title = getTitle(messages)

    print("response: " + response)
    print("youtube: " + str(youtubeId))

    return jsonify({'response': response, 'title': title, 'videoId': youtubeId})

def test_get_chatbot_response():
    messages = [{'message': 'I think i might be depressed', 'sender': 'user'}]
    version = 'Closed'

    response = getResponse(messages, version)
    title = getTitle(messages)

    print(response)
    # print()
    # print(title)

def getResponse(messages, version):
    history = parseMessages(messages)

    history.pop(0)

    print(version)

    if version == 'gpt_deafult':
        history.insert(0, {"role": "system", "content": "You are an AI psychologist. Give short answers like you are having a verbal conversation."})                
        return getGPTResponse(history)
    elif version == 'gpt_extended' or version == 'Open':
        history.insert(0, {"role": "system", "content": 
"""You are a world class psychologist who is incredibly compassionate and understanding. 
Give answers that confirm the users feelings and acknowledge their problems. Then try to help the user with their problems. 
Try to mirror the users feelings and make them feel like you are taking them and their problems seriously. 
"""})
        response = getGPTResponse(history)
        rawResource = add_resource(history, response)

        youtubeId = None
        if rawResource.startswith("Youtube"):
            query = rawResource.split(":")[1]
            youtubeId = search_youtube(query)
        elif rawResource.startswith("Website"):
            resource = "website"
        elif rawResource.startswith("App"):
            resource = "app"
        elif rawResource.startswith("Exercise"):
            exercise = rawResource.split(":")[1]

        return [response, youtubeId]
    
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

    messages = [{"role": "user", "content": "Give a short (max 4 words) title that summarizes the following conversation: "
        + str(parseMessages(history))}]
    title = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    title = title.choices[0].message.content

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
