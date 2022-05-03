import requests
import pandas as pd

search_list = [
    'swordartonline', 'monogatari', 'datealive', 'kaguya', 'fate', 'violetevergarden', 'singgeki', 'mushoku', 'tenseishitara', 'zerokara', 'onepunch', 'nisekoi', 'domestic', 'nogame', 'toradora', 'kiminona', 'schooldays', 'saenai', 'steinsgate', 'hibike', 'okarishimasu', 'horimiya', 'bisque', 'deathnote', 'cowboybibob', 'princessconnect', 'toaru', 'kimetsuno', 'neverland'
]

def MakeVideoList(search_list):
    video_list = []
    for title in search_list:
        url = 'https://staging.animethemes.moe/api/search'
        params = {
            'q': title
        }
        headers = requests.utils.default_headers()

        headers.update(
            {
            'User-Agent': 'My User Agent 1.0',
            }
        )

        response = requests.get(url, headers=headers, params=params)
        res = response.json()
        data = res['search']['videos']

        video_list = video_list + data

        df = pd.DataFrame(data=video_list)
        df.to_excel('anime.xlsx')

    return video_list

MakeVideoList(search_list)
