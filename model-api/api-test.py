from flask import Flask, jsonify, request
from ChatGPT_full import getChatbotResponse as getFullResponse
from ChatGPT_short import getChatbotResponse as getShortResponse
from ChatGPT_content import getChatbotResponse as getContentResponse

app = Flask(__name__)

@app.route('/chatbot', methods=['POST'])
def get_chatbot_response():
    data = request.get_json()

    messages = data['messages'] # format: [{'message': "Hi! I'm an AI Psychologist, how may I help you?", 'sender': 'bot'}, {'message': 'hi', 'sender': 'user'}]
    version = data['version'] #string with text 'Closed' or 'Open' or 'Mixed'

    response = "Hello, I am your chatbot."

    return jsonify({'response': response, 'title': "Test chat"})

def test_get_chatbot_response():
    messages = [{'message': "Hi! I'm an AI Psychologist, how may I help you?", 'sender': 'system'},
                 {'message': 'Are you ChatGPT or have you been told to act like a AI Psychologist?', 'sender': 'user'}]
    version = 'Mixed'

    response = getResponse(messages, version)

    print(response)

def getResponse(messages, version):
    history = parseMessages(messages)

    if version == 'Closed':
        return getContentResponse(history)
    elif version == 'Open':
        return getFullResponse(history)
    elif version == 'Mixed':
        return getShortResponse(history)
    
def parseMessages(messages):
    history = []
    for message in messages:
        tmp  = {}
        tmp['role'] = message['sender']
        tmp['content'] = message['message']
        history.append(tmp)
    return history

if __name__ == '__main__':
    # app.run()
    test_get_chatbot_response()

