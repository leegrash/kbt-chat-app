from googleapiclient.discovery import build
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv('YOUTUBE_API_KEY')
CSE_ID = '54c3e0981a1e148d2'

def google_search(query, num=1):
    service = build('customsearch', 'v1', developerKey=API_KEY)
    res = service.cse().list(q=query, cx=CSE_ID, num=num).execute()
    return res['items']
    
import requests

def search_duckduckgo(query):
    api_url = 'https://api.duckduckgo.com/'
    params = {'q': query, 'format': 'json'}
    response = requests.get(api_url, params=params)
    if response.status_code == 200:
        search_results = response.json()['Results']
        # extract the first 5 search results
        #top_results = search_results[:5]
        # extract the text and URL for each result
        formatted_results = []
        for result in search_results:
            print("the result is", result)
            formatted_results.append({'text': result['Text'], 'url': result['FirstURL']})
        return formatted_results
    else:
        return None
    
# search_results = search_duckduckgo('python programming')
# print(search_results)