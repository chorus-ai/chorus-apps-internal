import torch
import torch.nn as nn
import torch.nn.functional as F 
from siamaf_model.resnet1d import Res34SimSiam
from siamaf_model.dataset import Dataset_ori
from torch.utils.data import DataLoader
import numpy as np
import sys
from collections import OrderedDict
from data_handler import handleData


def test_epoch(MODEL_PATH, test_loader):
    
    state_dict = torch.load(MODEL_PATH, map_location=torch.device('cpu')) 
    new_state_dict = OrderedDict()
    for k, v in state_dict.items():
        name = k[7:] #remove 'module'
        new_state_dict[name] = v

    state_dict = new_state_dict
    model = Res34SimSiam(512, 128).cpu()
    model.load_state_dict(state_dict)

    with torch.no_grad():

        signal_preds = []
        signal_pred_probs = None
        all_targets = None
        
        model.eval()

        for batch_idx, signal in enumerate(test_loader):

            signal = signal.cpu().float()
            
            _, _, _, _, _, signal_out = model(signal, signal)
            
            signal_predicted = signal_out.argmax(1)
            signal_preds.append(signal_predicted.detach().cpu().numpy())
            
    return np.concatenate(signal_preds)


def main():
    FILE_TYPE = sys.argv[1]
    FILE_PATH = sys.argv[2]
    MODEL_PATH = 'python-scripts/siamaf_model/model.pt'

    data = handleData(FILE_TYPE, FILE_PATH, 80, 30)
    dataset = Dataset_ori(data)
    dataloader = DataLoader(dataset, batch_size=1, shuffle=False, num_workers=0)
    predictions = test_epoch(MODEL_PATH, dataloader)

    print(predictions.tolist())

if __name__ == '__main__':
    main()