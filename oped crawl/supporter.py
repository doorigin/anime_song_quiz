import pandas as pd
import json

def excel_to_list(path):
    df = pd.read_excel(path)
    df = df.values.tolist()
    # print(df)
    total_list = []
    for item in df:
        answer = [x for x in item[1:] if str(x) != 'nan']
        l = []
        l.append(answer)
        l.append(item[0])
        total_list.append(l)
    return total_list

data = excel_to_list('애니노래DB.xlsx')

print(data)