from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/chatbot')
def get_chatbot_response():
    # Call your chatbot code here and return the response
    # enskilt response, en sträng
    # Title, bara sträng
    response = "Hello, I am your chatbot."
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run()