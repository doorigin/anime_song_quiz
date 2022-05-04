import requests
import pandas as pd
import time

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

def AllList():
    i=0
    flag = True
    data = []
    url = 'https://staging.animethemes.moe/api/video?page%5Bsize%5D=100&page%5Bnumber%5D=1'
    while flag == True:
        headers = requests.utils.default_headers()

        headers.update(
            {
            'User-Agent': 'My User Agent 1.0',
            }
        )

        response = requests.get(url, headers=headers)
        res = response.json()
        data += res['videos']

        url = res['links']['next']
        if url == "null" or str(url)=="null" or url==None:
            flag = False
        
        time.sleep(1)
        print(i)
        i+=1
    print('converting..')
    df = pd.DataFrame.from_dict(data)
    df.to_excel('anime.xlsx')
    
AllList()
