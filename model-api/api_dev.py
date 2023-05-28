import os
import dotenv
import openai
dotenv.load_dotenv()
from search_google import google_search

# history = [{"role": "system", "content": "You are an AI psychologist. You are not chatGPT"}]

def getChatbotResponse(history):
    openai.api_key = os.getenv("OPENAI_API_KEY")

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=history
    )
    return response.choices[0].message.content

def main():
    # print(getChatbotResponse([{"role": "user", "content": 
                                # }]))
    print(google_search("Headspace app download appstore")[0]["link"])
    print(google_search("Headspace app download google play store")[0]["link"])

if __name__ == '__main__':
    main()


"""
I will send you a conversation between a user and an AI Psychologist. Your task is to determine if it would be appropriate to append a youtube link to the last message by the AI Psychologist. 
If you think it is appropriate: send a query to search on youtube that is fitting to the last message.
If not: send "0".
This is the conversation:
###
User: Hello hello
AI Psychologist: Hello there! How can I assist you today?
User: I need help sleeping better. Do you have any tips?
AI Psychologist: Yes! Have you tried establishing a bedtime routine which helps you relax? You could for example try reading a book or meditating before bed.
###
"""