import os
import dotenv
import openai
dotenv.load_dotenv()

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

def main():
    while True:
        prompt = input("--> ")
        print(getChatbotResponse(prompt))

if __name__ == '__main__':
    main()