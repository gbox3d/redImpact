#%%
# TensorFlow and tf.keras
import tensorflow as tf
import json
import sys
import pprint
from tensorflow import keras
from tflite_support.metadata_writers import object_detector
from tflite_support.metadata_writers import writer_utils

# Helper libraries
import numpy as np
import argparse

from object_detection.utils import label_map_util
from object_detection.utils import config_util
from object_detection.utils import visualization_utils as viz_utils
# from object_detection.utils import colab_utils
from object_detection.utils import config_util
from object_detection.builders import model_builder

#%%
def _addMetaData(_input_path,_output_path,_label_path,_input_mean=[127.5],_input_std=[127.5]) :
    writer = object_detector.MetadataWriter.create_for_inference(
        writer_utils.load_file(_input_path), 
        input_norm_mean=_input_mean, input_norm_std=_input_std, 
        label_file_paths=_label_path)
    writer_utils.save_file(writer.populate(), _output_path)


#%%
work_path = '/home/gbox3d/work/'
data_set = 'handsign'
model_name = 'my_ssd_model'
# _LABEL_PATH='/home/gbox3d/work/dataset/handsign/workspace/label_map.pbtext'
#%%
parser = argparse.ArgumentParser(
    description="tflite savemodel to tflite expoter")
parser.add_argument("-d",
                    "--dataset",
                    help="select dataset", type=str)

parser.add_argument("-m",
                    "--model_name",
                    help="select model name", type=str)
#%%
args = parser.parse_args()

data_set = args.dataset
model_name = args.model_name

#%% construct path
_export_path = f'{work_path}/dataset/{data_set}/workspace/models/{model_name}/tfliteexport'
_label_map_path = f'{work_path}/dataset/{data_set}/workspace/label_map.pbtext'
print(_export_path)
print(_label_map_path)

#%%
_ODT_LABEL_MAP_PATH = _label_map_path
_TFLITE_LABEL_PATH = f'{_export_path}/label_map.txt'
category_index = label_map_util.create_category_index_from_labelmap(
    _ODT_LABEL_MAP_PATH)
f = open(_TFLITE_LABEL_PATH, 'w')
for class_id in range(1, 91):
  if class_id not in category_index:
    f.write('???\n')
    continue
  name = category_index[class_id]['name']
  f.write(name+'\n')
f.close()
print(f'{_TFLITE_LABEL_PATH} ... ok')

#%% fp32
_TFLITE_MODEL_PATH = f'{_export_path}/{data_set}.tflite'
_TFLITE_MODEL_WITH_METADATA_PATH = f"{_export_path}/{data_set}_with_metadata.tflite"
converter = tf.lite.TFLiteConverter.from_saved_model(f'{_export_path}/saved_model')
tflite_model = converter.convert()
open(_TFLITE_MODEL_PATH, "wb").write(tflite_model)
#add meta 
_addMetaData(_TFLITE_MODEL_PATH,_TFLITE_MODEL_WITH_METADATA_PATH,[_TFLITE_LABEL_PATH])

#%%fp16,  IEEE 표준 인 float16
_TFLITE_MODEL_PATH = f'{_export_path}/{data_set}_fp16.tflite'
_TFLITE_MODEL_WITH_METADATA_PATH = f"{_export_path}/{data_set}_fp16_with_metadata.tflite"
converter = tf.lite.TFLiteConverter.from_saved_model(f'{_export_path}/saved_model')
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.target_spec.supported_types = [tf.float16]
tflite_model = converter.convert()
open(_TFLITE_MODEL_PATH, "wb").write(tflite_model)
#add meta 
_addMetaData(_TFLITE_MODEL_PATH,_TFLITE_MODEL_WITH_METADATA_PATH,[_TFLITE_LABEL_PATH])

#%%fp8
_TFLITE_MODEL_PATH = f'{_export_path}/{data_set}_fp8.tflite'
_TFLITE_MODEL_WITH_METADATA_PATH = f"{_export_path}/{data_set}_fp8_with_metadata.tflite"
converter = tf.lite.TFLiteConverter.from_saved_model(f'{_export_path}/saved_model')
converter.optimizations = [tf.lite.Optimize.DEFAULT]
# converter.target_spec.supported_types = [tf.float16]
tflite_model = converter.convert()
open(_TFLITE_MODEL_PATH, "wb").write(tflite_model)
#add meta 
_addMetaData(_TFLITE_MODEL_PATH,_TFLITE_MODEL_WITH_METADATA_PATH,[_TFLITE_LABEL_PATH])

#참고자료 :
#https://www.tensorflow.org/lite/performance/post_training_quantization
