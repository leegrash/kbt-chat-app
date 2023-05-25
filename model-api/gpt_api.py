import os
import dotenv
import openai
dotenv.load_dotenv()

# history = [{"role": "system", "content": "You are an AI psychologist. You are not chatGPT"}]

def getChatbotResponse(history):
    openai.api_key = os.getenv("OPENAI_API_KEY_1")

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=history
    )
    return response.choices[0].message.content

def main():
    while True:
        prompt = input("--> ")
        print(getChatbotResponse(prompt, [{"role": "system", "content": "You are an AI psychologist. You are not chatGPT"}]))

