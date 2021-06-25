#%%
import yaml
import os
import shutil
import argparse 
from pathlib import Path
from random import shuffle
from math import trunc
# from xml.etree.ElementTree import parse
print('start voc2tfod v1.0')
#%%
dataset_path = '/home/gbox3d/work/dataset/handsign'

#%%
parser = argparse.ArgumentParser()
parser.add_argument('--dataset-path', type=str, default=dataset_path ,help='data set path')
parser.add_argument('--no-log',action='store_true', help='Dont display log')

opt = parser.parse_args()
dataset_path = opt.dataset_path
no_log = opt.no_log
print(no_log)
print('data set path : ' + dataset_path)

# %%
def _doSplit(train_rt=0.7,valid_rt=0.2,no_log=True) :

    src_path = f'{dataset_path}/voc'

    train_path = f'{dataset_path}/train'
    val_path = f'{dataset_path}/valid'
    test_path = f'{dataset_path}/test'

    path_list = [train_path,val_path,test_path]

    for _path in path_list :
        if os.path.exists(_path):
            shutil.rmtree(_path)  # delete output folder
        os.makedirs(_path) 
        # os.makedirs(_path+'/labels') 
        # os.makedirs(_path+'/images') 

    _path = Path(src_path)
    
    files = _path.glob('*')
    _file_list = list(files)
    xml_files = [x for x in _file_list if str(x).split('.')[-1].lower() in ['xml']]
    
    if no_log is not True:
        print(xml_files)

    #검증세트 분리하기 
    shuffle(xml_files)

    _size = len(xml_files)

    _start_index = 0
    _end_index = trunc(_size * train_rt)
    _train_list = xml_files[ _start_index : _end_index]
    _start_index = _end_index
    _end_index =  trunc( _size * (train_rt + valid_rt) )
    _valid_list = xml_files[ _start_index : _end_index ]
    _test_list = xml_files[ _end_index :  ]

    if no_log is not True:
        print(_train_list)
        print(_valid_list)
        print(_test_list)

    _file_list_set = (_train_list,_valid_list,_test_list)

    for _i in range(0, 3) :
        # _out_path = path_list[_i] + '/labels'
        _out_path = path_list[_i]
        _file_list = _file_list_set[_i]

        print(f'output :{ _out_path} , {len(_file_list)}')
        
        for _file in _file_list :
            _fname = _file.stem

            _f_sets = list(_path.glob(f'{_fname}.*') )

            for _item in _f_sets :
                shutil.copy(f'{_item}',_out_path)
    print(f'train : {len(_train_list)} , valid : {len(_valid_list)} , test : {len(_test_list)}')

#%%
config_data = {}
label_dic = {}
dataset_config_file = f'{dataset_path}/data.yaml'
try:
    with open(dataset_config_file, 'r') as f:
        config_data = yaml.safe_load(f)
        
        pbtxt_strbuf = ""
        for _index,_lb in enumerate(config_data['names'] ):
            # print(_lb)
            pbtxt_strbuf += f'item {{ \n'
            pbtxt_strbuf += f'\tname:\'{_lb}\'\n'
            pbtxt_strbuf += f'\tid:{_index+1}\n'
            pbtxt_strbuf += f'}}\n'

            label_dic[_lb] = _index
        label_path = dataset_config_file['label_map_file']#f'{dataset_path}/label_map.pbtext'
        with open(label_path, 'w') as f:
            f.write(pbtxt_strbuf)
            print(f'created {label_path}')
        
        _doSplit()
        print('complete')
except  Exception as ex:   
    config_data = None 
    print(ex)


# %%
