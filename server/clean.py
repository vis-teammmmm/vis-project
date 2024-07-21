import chardet
import pandas as pd
import sys
from io import StringIO
import json

def detect_encoding(file_path):
    with open(file_path, 'rb') as file:
        rawdata = file.read(5000)
    return chardet.detect(rawdata)['encoding']

def read_and_clean_csv(file_path):
    # 假设 CSV 文件的编码已知，如果不知道具体编码可以用chardet库来检测
    encoding = detect_encoding(file_path)
    df = pd.read_csv(file_path, encoding=encoding)

    # 示例数据清洗：去除重复值
    df_cleaned = df.drop_duplicates()

    # 返回清洗后的数据
    return df_cleaned

def main(file_path):
    output_path = "uploads/output.json"
    df = read_and_clean_csv(file_path)
    df.to_json(output_path, orient='records', force_ascii=False)
    print(output_path)  # 输出文件路径

if __name__ == "__main__":
    # 命令行参数中获取文件路径
    file_path = sys.argv[1]
    main(file_path)
