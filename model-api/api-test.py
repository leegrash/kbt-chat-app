from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/chatbot', methods=['POST'])
def get_chatbot_response():
    data = request.get_json()

    messages = data['messages'] # format: [{'message': "Hi! I'm an AI Psychologist, how may I help you?", 'sender': 'bot'}, {'message': 'hi', 'sender': 'user'}]
    version = data['version'] #string with text 'Closed' or 'Open' or 'Mixed'

    response = "Hello, I am your chatbot."

    return jsonify({'response': response, 'title': "Test chat"})

if __name__ == '__main__':
    app.run()
