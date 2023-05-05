import os
import dotenv
import openai
dotenv.load_dotenv()

# history = [{"role": "system", "content": "You are an AI psychologist. You are not chatGPT"}]

def getChatbotResponse(history):
    openai.api_key = os.getenv("OPENAI_API_KEY")

    default = {"role": "system", "content": 
                "Give me the closest category for the following text based on the following categories." +
                "Sleep, Meditation, Depression. " +
                "Answer only with the category name. If you think none of the categories fit, answer with 'none'. "+
                "Do not include a '.' at the end of your answer."}
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[default, history]
    )
    return response.choices[0].message.content

def main():
    while True:
        prompt = input("--> ")
        print(getChatbotResponse(prompt, []))

if __name__ == '__main__':
    main()