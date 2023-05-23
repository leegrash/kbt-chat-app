import requests

from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv('YOUTUBE_API_KEY')

api_key = API_KEY

# use the youtube search api to search for cats
def search_youtube(query):
    url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=%s&type=video&key=%s" % (query, api_key)
    response = requests.get(url)
    data = response.json()
    # only take the first results url
    video_id = data["items"][0]["id"]["videoId"]

    youtube_format = "https://www.youtube.com/watch?v=%s" % video_id

    print(data)
    return youtube_format


# # use the youtube search api to search for cats
# response = search_youtube("mindfulness meditation")
# print(response)