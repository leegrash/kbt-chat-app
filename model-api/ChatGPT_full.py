import os
import dotenv
import openai
from flask import Flask, jsonify

dotenv.load_dotenv()
app = Flask(__name__)

history = [{"role": "system", "content": "You are an AI psychologist. You are not chatGPT"}]

def getChatbotResponse(prompt):
    history.append({"role": "user", "content": prompt})

    openai.api_key = os.getenv("OPENAI_API_KEY")

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=history
    )
    history.append({"role": "system", "content": response.choices[0].message.content})
    return response.choices[0].message.content

@app.route('/chatbot')
def get_chatbot_response():
    while True:
        prompt = input("--> ")
        return getChatbotResponse(prompt)

if __name__ == '__main__':
    app.run()