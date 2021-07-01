#%%
# import os
import yaml

import tensorflow as tf
# from object_detection.utils import config_util
from object_detection.protos import pipeline_pb2
from google.protobuf import text_format

print("module load ok")
print(f"tf : {tf.__version__}")

#%%
__version__ = '1.0.0'
print(f'config_updater v {__version__}')

#%%
def update_config(data_conf_file,model_name) :
    with open(data_conf_file) as f :
        _config = yaml.load(f, Loader=yaml.FullLoader)
        # print(_config)

    if _config['tf'] != "" : tfconf = _config['tf'][model_name]
    else : tfconf = _config['tf']

    config_file_path = tfconf['pipeline_config']
   
    pipeline_config = pipeline_pb2.TrainEvalPipelineConfig()
    with tf.io.gfile.GFile( config_file_path , "r") as f:                                                                                                                                                                                                                     
        proto_str = f.read()                                                                                                                                                                                                                                          
        text_format.Merge(proto_str, pipeline_config)  
    # print(pipeline_config)

    pipeline_config.model.ssd.num_classes = _config['nc']
    pipeline_config.train_config.batch_size = tfconf['train_batch_size']
    pipeline_config.train_config.fine_tune_checkpoint = tfconf['fine_tune_checkpoint']
    pipeline_config.train_config.fine_tune_checkpoint_type = tfconf['fine_tune_checkpoint_type']
    pipeline_config.train_input_reader.label_map_path= tfconf['label_map_file']
    pipeline_config.train_input_reader.tf_record_input_reader.input_path[:] = [tfconf['train_record']]
    pipeline_config.eval_input_reader[0].label_map_path = tfconf['label_map_file']
    pipeline_config.eval_input_reader[0].tf_record_input_reader.input_path[:] = [tfconf['valid_record']]

    # print(pipeline_config)
    # %% save pipe line config
    config_text = text_format.MessageToString(pipeline_config)                                                                                                                                                                                                        
    with tf.io.gfile.GFile( tfconf['pipeline_config'], "wb") as f:                                                                                                                                                                                                                     
        f.write(config_text)  
    print(f'{tfconf["pipeline_config"]} saved ok.')

# %%
if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(
        description="pipline config updater v1.0")
    parser.add_argument("-d",
        "--data-file",
        help="full path for data.yaml file",
        type=str)
    parser.add_argument("-m",
        "--model-name",
        default="",
        help="full path for data.yaml file",
        type=str)
    args = parser.parse_args()
    data_conf_file = args.data_file
    model_name = args.model_name

    try :
        update_config(data_conf_file,model_name)
    except  Exception as ex:
        print(ex)
        print('error.')

