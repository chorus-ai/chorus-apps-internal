import sys
import os
from vpp_model.get_df import get_df
from vpp_model.set_x import set_X
import pickle

def predict(url, year):
    # load the model from pickle file
    with open('python-scripts/vpp_model/models/ridge_model.pkl', 'rb') as f:
        lr = pickle.load(f)

    df = get_df(url, year)

    if df.iloc[0]['age'] == -1:
        # if the car is not listed or the url is not correct
        return -1

    X = set_X(df)
    y = lr.predict(X)
    return y[0]

def main():
    link = sys.argv[2]
    year = sys.argv[3]
    # print(link)
    # print(year)
    predictedPrice = predict(link, year)
    print(predictedPrice)

if __name__ == '__main__':
    main()