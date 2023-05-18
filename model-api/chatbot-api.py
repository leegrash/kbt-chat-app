from flask import Flask, jsonify, request
from gpt_api import getChatbotResponse as getGPTResponse
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

    print("response: " + response)

    return jsonify({'response': response, 'title': title})

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

    if version == 'Closed':
        history.insert(0, {"role": "system", "content": "You are an AI psychologist. Give short answers like you are having a verbal conversation."})        
        return getGPTResponse(history)
    elif version == 'Open':
        history.insert(0, {"role": "system", "content": 
                           """
                           You are a world class psychologist who is incredibly compassionate and understanding. 
                            Give answers that confirm the users feelings and acknowledge their problems. Then try to help the user with their problems. 
                            Try to mirror the users feelings and make them feel like you are taking them and their problems seriously. 
                            A good answer to the prompt 'I think i might be depressed' would be 
                            'I'm sorry to hear that you're feeling sad. It's normal to feel sad sometimes. 
                            Can you tell me a little bit more about what's been going on in your life that may have contributed to your feelings of sadness?', 
                            because it shows empathy and acknowledgment, but still tries to help the user find the cause of their problem.
                           """
                            })
        response = getGPTResponse(history)
        return 
    elif version == 'Mixed':
        history.insert(0, {"role": "system", "content": "You are a duck. Quack."})
        return getGPTResponse(history)
    
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

    messages = [{"role": "system", "content": "Give a short (max 4 words) title that summarizes the following conversation: "
        + str(parseMessages(history))}]
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
