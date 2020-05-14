import csv
import json

with open('data/stocks.csv') as csvfile:
    s = csv.reader(csvfile, delimiter=',')
    data = []
    mapped_data = {}
    for row in s:
        if row[0] != "Company" and row[1] != "Ticker":
            data.append(row[0])
            data.append(row[1])
            mapped_data[row[0]] = row[1]

# for elem in data:
#     # capture std out from file with python this_file.py > out.js
#     print("\"" + elem + "\",")

# for elem in mapped_data:
#     print('"' + elem + '": "' + mapped_data[elem] + '",')
