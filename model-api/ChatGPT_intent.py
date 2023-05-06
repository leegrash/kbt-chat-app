import os
import dotenv
import openai
from ChatGPT_full import getChatbotResponse as getFullResponse
dotenv.load_dotenv()

# history = [{"role": "system", "content": "You are an AI psychologist. You are not chatGPT"}]

def getChatbotResponse(history):
    intent = getIntent(history[-1])
    if "Sleep" in intent:
        return "Have you tried some relaxation techniques? Turning off all screens an hour before bed and reading a book can help you sleep better."
    elif "Meditation" in intent:
        return "Here is a link to a meditation mp3: https://www.youtube.com/watch?v=inpok4MKVLM. I hope it helps"
    elif "Depression" in intent:
        return "Here is a link to a pdf about depression: https://www.nimh.nih.gov/health/publications/depression/index.shtml. \n" + \
                "Always remember that you are not alone. There are people who care about you and want to help you."
    elif "none" in intent:
        return "I am sorry to hear that. I am not trained to help you with that, but here is the answer given by ChatGPT. \n" + \
                getFullResponse(history)

def getIntent(history):
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