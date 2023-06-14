import openai
import os
import dotenv
from youtube import search_youtube

def add_resource(history, lastMessage):
    conv = parse_conv(history, lastMessage)

    dotenv.load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY_1")    

    prompt = """
I will send you a conversation between a user and an AI Psychologist. 
Your task is to determine if it would be appropriate to append a youtube link, a link to a website, a link to an app, or an AI Generated exercise to the last message by the AI Psychologist. 
If you think it is appropriate to send a youtube video: send a query to search on youtube that is fitting to the last message. Send it in this format: "Youtube: {query}".
If you think it is appropriate to send a link to a website: send the name of the website that is fitting. Send it in the format: "Website: {website_name}".
If you think it is appropriate to send a link to an app: send the name of the app that is fitting. Send it in this format: "App: {app_name}".
If you think it is appropriate to send an AI generated exercise: Design an exercise. Send it in this format: "Exercise: {exercise_description}".
If you do not think it is appropriate to send anything: send "0".
Keep in mind that it is not appropriate to send many resources in sequence, and that too many resources may confuse the user.
This is the conversation:

"""
    prompt += "###\n" + conv + "\n###"

    history = [{"role": "user", "content": prompt}]

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=history
    )

    print(response.choices[0].message.content)

    return response.choices[0].message.content
    

def parse_conv(history, lastMessage = None):
    conv = "AI Psychologist: " + "Hi! I'm an AI Psychologist, how may I help you?\n"
    for message in history[1:]:
        if message['role'] == 'system':
            conv += "AI Psychologist: " + message['content'] + "\n"
        elif message['role'] == 'user':
            conv += "User: " + message['content'] + "\n"
    if lastMessage != None:
        conv += "AI Psychologist: " + lastMessage + "\n"
    return conv