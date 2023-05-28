import requests

from dotenv import load_dotenv
import os


# use the youtube search api to search for cats
def search_youtube(query):
    load_dotenv()
    api_key = os.getenv('YOUTUBE_API_KEY')
    
    url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=%s&type=video&key=%s" % (query, api_key)
    response = requests.get(url)
    data = response.json()
    # only take the first results url
    video_id = data["items"][0]["id"]["videoId"]

    return video_id


# # use the youtube search api to search for cats
# response = search_youtube("mindfulness meditation")
# print(response)