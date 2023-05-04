import re

# regex that parses the prompt for the media type and content. parsing should be on the format $[mediatype, content]$
def parsePrompt(prompt):
    if re.search("\$\[.*\,.*\]\$", prompt):
        return re.search("\$\[.*\,.*\]\$", prompt).group(0)
    else:
        return "empty"

print(parsePrompt("Hello, I am a chatbot. I can send you media. $[pdf, sleep]$"))
