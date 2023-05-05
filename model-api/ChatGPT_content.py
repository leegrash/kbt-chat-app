import os
import dotenv
import openai
import re

dotenv.load_dotenv()

# history = [{"role": "system", "content": "You are an AI psychologist. You are not chatGPT." +
#             "Give short answers like you are having a verbal conversation. \n" +
#             "You will be used as the language engine in a chatbot that can send media. \n" +
#             "The media that is avallible is pdfs about Sleep, depression and meditation, mp3s about meditation and jpgs about meditation. \n" +
#             "If you want to send the user some form of media, use the following format: $[mediatype, content]$." + 
#             "The mediatype can be pdf, mp3 or jpg. The content can be Sleep, depression or meditation \n"}]

def getChatbotResponse(history):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=history
    )
    return response.choices[0].message.content

def addResources(prompt):
    if re.search("\$\[.*\,.*\]\$", prompt):
        prompt = re.sub("\$\[.*\,.*\]\$", "THIS IS A FILE", prompt)
    return prompt

def main():
    while True:
        prompt = input("--> ")
        rawResponse = getChatbotResponse(prompt)
        print(addResources(rawResponse))

if __name__ == '__main__':
    main()