#%%
import os
import pathlib
import yaml

import tensorflow as tf
# from object_detection.utils import config_util
from object_detection.protos import pipeline_pb2
from google.protobuf import text_format

print("module load ok")
print(f"tf : {tf.__version__}")

#%%
__version__ = '1.0.1'
print(f'config_updater v {__version__}')

#%%
def update_config(data_set,model_name) :

    data_conf_file = data_set + '/data.yaml'

    with open(data_conf_file) as f :
        _config = yaml.load(f, Loader=yaml.FullLoader)
        # print(_config)

    if model_name != '' : tfconf = _config['tf'][model_name]
    else : 
        tfconf = _config['tf']
        model_name = 'custom_model'

    config_file_path = tfconf['pipeline_config_proto']
   
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

    output_file = tfconf['pipeline_config']

    _model_dir = pathlib.Path(output_file).parent.resolve()

    if os.path.exists(_model_dir) is False :
        os.makedirs(_model_dir) 

    #     # shutil.rmtree(_test_dir)  # delete output folder
    #     os.makedirs(_model_dir) 

    # print(pipeline_config)
    # %% save pipe line config
    config_text = text_format.MessageToString(pipeline_config)                                                                                                                                                                                                        
    with tf.io.gfile.GFile( output_file, "wb") as f:                                                                                                                                                                                                                     
        f.write(config_text)  
    print(f'{tfconf["pipeline_config"]} saved ok.')

# %%
if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(
        description=f"pipline config updater {__version__}")
    parser.add_argument("-d",
        "--data-set",
        help="full path for data set path",
        type=str)
    parser.add_argument("-m",
        "--model-name",
        default="",
        help="full path for data.yaml file",
        type=str)
    args = parser.parse_args()
    data_set = args.data_set
    model_name = args.model_name

    try :
        update_config(data_set,model_name)
    except  Exception as ex:
        print(ex)
        print('error.')

