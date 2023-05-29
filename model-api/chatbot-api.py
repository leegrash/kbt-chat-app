from flask import Flask, jsonify, request
from gpt_api import getChatbotResponse as getGPTResponse
from resources import add_resource, parse_conv
from youtube import search_youtube
from search_google import google_search
import re
import openai
import os
import dotenv

dotenv.load_dotenv()

app = Flask(__name__)

@app.route('/get-title', methods=['POST'])
def get_title():
    data = request.get_json()

    messages = data['messages']

    title = getTitle(messages[:-1], messages[-1]["message"])

    return jsonify({'title': title})

@app.route('/chatbot', methods=['POST'])
def get_chatbot_response():
    data = request.get_json()

    messages = data['messages'] # format: [{'message': "Hi! I'm an AI Psychologist, how may I help you?", 'sender': 'bot'}, {'message': 'hi', 'sender': 'user'}]
    version = data['version'] #string with text 'Closed' or 'Open' or 'Mixed'

    [response, youtubeId] = getResponse(messages, version)
    title = getTitle(messages, response)

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

    if version == 'gpt_default' or version == 'Closed':
        history.insert(0, {"role": "system", "content": "I am an AI psychologist. I give short answers like I am having a verbal conversation."})
        return [getGPTResponse(history), "None"]
    elif version == 'gpt_extended' or version == 'Open':
        history.insert(0, {"role": "system", "content": 
"""
I am a world class psychologist who is incredibly compassionate and understanding. 
I give answers that confirm the users feelings and acknowledge their problems. Then I try to help the user with their problems. 
I try to mirror the users feelings and make them feel like I am taking them and their problems seriously. 
I give short answers like I am having a verbal conversation.
"""})
        response = getGPTResponse(history)
        print(response)
        rawResource = add_resource(history, response)

        youtubeId = "None"
        if rawResource.startswith("Youtube"):
            query = rawResource.split(":")[1]
            youtubeId = search_youtube(query)
            response += "\n\nHere is a video that might help you: \n"
        elif rawResource.startswith("Website"):
            resource = rawResource.split(":")[1]
            response += "\n\nHere is a website that might help you: \n"
            response += google_search(f"{resource} website")[0]["link"]
        elif rawResource.startswith("App"):
            resource = rawResource.split(":")[1]
            response += "\n\nHere is an app that you can try: \n"
            response += google_search(f"{resource} app download appstore")[0]["link"] + "\n"
            response += google_search(f"{resource} app download google play store")[0]["link"]
        elif rawResource.startswith("Exercise"):
            exercise = rawResource.split(":")[1].strip()
            response += "\n\nHere is an exercise that I created for you: \n"
            response += exercise
        return [response, youtubeId]
    
    return ["Something went wrong. Please try again", "None"]
    
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

def getTitle(history, lastPrompt):
    openai.api_key = os.getenv("OPENAI_API_KEY_1")

    messages = [{"role": "user", "content": "Give a short (max 4 words) title that summarizes the following conversation." + \
                 "The focus should be on what the conversation is about, not that it is a conversation with an AI Psychologist."
        + str(parse_conv_from_history(history, lastPrompt))}]

    title = openai.ChatCompletion.create(
        model="gpt-4",
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

def parse_conv_from_history(history, lastPrompt):
    conv = "Chatbot: Hi! I'm an AI Psychologist, how may I help you? \n"
    for message in history:
        if message["sender"] == "user":
            conv += "User: " + message["message"] + "\n"
        elif message["sender"] == "system":
            conv += "Chatbot: " + message["message"] + "\n"
    conv += "Chatbot: " + lastPrompt
    return conv

if __name__ == '__main__':
    app.run()
    # test_get_chatbot_response()
