#%%
import os
import yaml
import argparse
import shutil
#%%
dataset_path='/home/gbox3d/work/dataset'
dataset_name='hello'
class_names='ok,hi,hello,bye'
fine_tune_model = 'ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8'
train_batch_size = 8
#%%
parser = argparse.ArgumentParser(
    description="pipline config updater v1.0")
parser.add_argument("-d",
    "--dataset",
    default=dataset_path,
    help="path for dataset",
    type=str)
parser.add_argument("-n",
    "--name",
    default=dataset_name,
    help="dataset name",
    type=str)
parser.add_argument("-c",
    "--class-names",
    default=dataset_name,
    help="classes name",
    type=str)
parser.add_argument("-f",
    "--ftmodel",
    default=fine_tune_model,
    help="fine tune model name",
    type=str)
parser.add_argument("-b",
    "--train-batch-size",
    default=train_batch_size,
    help="train batch size",
    type=str)
args = parser.parse_args()
dataset_path = args.dataset
dataset_name = args.name
fine_tune_model = args.ftmodel
train_batch_size = args.train_batch_size
#%% create base dir
# print(os.path.join(dataset_path,dataset_name))
_dataset_path = os.path.join(dataset_path,dataset_name)
if os.path.exists(_dataset_path) is not True:
    # shutil.rmtree(_dataset_path)  # delete output folder
    os.makedirs(_dataset_path)
    os.makedirs(os.path.join(_dataset_path,'src'))
    os.makedirs(os.path.join(_dataset_path,'voc')) 
    os.makedirs(os.path.join(_dataset_path,'workspace')) 
    os.makedirs(os.path.join(_dataset_path,'workspace','models')) 
    os.makedirs(os.path.join(_dataset_path,'workspace','pre-trained-models')) 
    print(f'create {_dataset_path}')
else :
    print(f'exists')

# %% createe data.yaml
_cls_names = class_names.split(',')
print(_cls_names)

#%%
_data_yaml = {
    'train' : os.path.join(_dataset_path,'train','images'),
    'val' : os.path.join(_dataset_path,'valid','images'),
    'voc' : os.path.join(_dataset_path,'voc'),
    'nc': len(_cls_names),
    'names': _cls_names,
    'yolov5' : {'tool_path' : '<yolo v5 tool path>' },
    'tf' : {
        'pipeline_config' : os.path.join(_dataset_path,'workspace','models','mymodel','pipeline.config'),
        'label_map_file' : os.path.join(_dataset_path,'workspace','label_map.pbtext'),
        'train_batch_size' : train_batch_size,
        'train_record' : os.path.join(_dataset_path,'workspace','train.record'),
        'valid_record' : os.path.join(_dataset_path,'workspace','valid.record'),
        'fine_tune_checkpoint' : os.path.join(_dataset_path,'workspace','pre-trained-models',fine_tune_model,'checkpoint','ckpt-0'),
        'fine_tune_checkpoint_type' : 'detection'
    }
  
}

with open(os.path.join(_dataset_path,'data.yaml'), 'w') as f:
    yaml.dump(_data_yaml, f)


# %%
