from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/chatbot', methods=['POST'])
def get_chatbot_response():
    # get the JSON object from the request
    data = request.get_json()

    # access the 'messages' and 'version' keys in the JSON object
    messages = data['messages'] # format: [{'message': "Hi! I'm an AI Psychologist, how may I help you?", 'sender': 'bot'}, {'message': 'hi', 'sender': 'user'}]
    version = data['version'] #string with text 'Closed' or 'Open' or 'Mixed'

    # define the 'response' variable
    response = "Hello, I am your chatbot."
    print(response)

    return jsonify({'response': response})

if __name__ == '__main__':
    app.run()
