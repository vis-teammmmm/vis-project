import chardet
import pandas as pd
import sys
from io import StringIO
import json
import numpy as np

def detect_encoding(file_path):
    with open(file_path, 'rb') as file:
        rawdata = file.read(5000)
    return chardet.detect(rawdata)['encoding']

def read_and_clean_csv(file_path):
    encoding = detect_encoding(file_path)
    df = pd.read_csv(file_path, encoding=encoding)

    # 使用.drop_duplicates()并立即赋值回df以避免SettingWithCopyWarning
    df = df.drop_duplicates()

    for col in df.columns:
        if df[col].dtype == 'object':
            # 使用 .loc[] 来确保操作的是DataFrame的视图而非副本
            df.loc[:, col] = df.loc[:, col].astype(str).str.replace(',', '')
            df.loc[:, col] = df.loc[:, col].replace('nan', np.nan)  # 将 'nan' 字符串转换为真正的 NaN 值
            
            try:
                df.loc[:, col] = pd.to_numeric(df.loc[:, col])

            except ValueError:
                pass

    return df

def main(file_path):
    output_path = "uploads/output.json"
    df = read_and_clean_csv(file_path)
    df.to_json(output_path, orient='records', force_ascii=False)
    print(output_path)  # 输出文件路径

if __name__ == "__main__":
    # 命令行参数中获取文件路径
    file_path = sys.argv[1]
    main(file_path)
