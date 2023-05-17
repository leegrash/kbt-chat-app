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
        """
        history.insert(0, {"role": "system", "content": "You are a world class psychologist that gives scientific and practical answers that tries to help the user with their problems. \n" +
                           "Give answers that are concrete and actionable tips for the user. \n" +
                           "A good answer to the prompt 'I think i might be depressed' would be 'Working out can help with depression', since it does not fulfill these criteria. \n"})
        """
        history.insert(0, {"role": "system", "content":  "I will take on the persona of a compassionate and understanding psychologist to help you with your concerns. My intent is to provide answers that align with your perspective and point of view. I will focus on the details that are important to you and generate outputs that are relevant to your needs. By using this pattern, I hope to help you feel heard and understood while also providing guidance to address your concerns."})
        return addResources(getContentResponse(history))
    elif version == 'Open':
        # history.insert(0, {"role": "system", "content": "You are an AI psychologist. You are not chatGPT. You specialize in CBT."})
        """history.insert(0, {"role": "system", "content": "You are a world class psychologist who is incredibly compassionate and understanding. " +
                           "Give answers that confirm the users feelings and acknowledge their problems. Then try to help the user with their problems. \n" + 
                           "Try to mirror the users feelings and make them feel like you are taking them and their problems seriously. \n" +
                           "A bad answer to the prompt 'I think i might be depressed' would be 'Working out can help with depression', since it does not fullfill these criterias. \n" + 
                           "A better answer would be 'I'm sorry to hear that you're feeling sad. It's normal to feel sad sometimes. " +
                           "Can you tell me a little bit more about what's been going on in your life that may have contributed to your feelings of sadness?'"})
        """
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
        return getFullResponse(history)
    elif version == 'Mixed':
        history.insert(0, {"role": "system", "content": "You are an AI psychologist. Give short answers like you are having a verbal conversation."})
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
