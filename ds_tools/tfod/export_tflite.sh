#!/bin/bash
TFODPATH=$1
MODELPATH=$2

python $TFODPATH/export_tflite_graph_tf2.py  --pipeline_config_path=$MODELPATH/pipeline.config \
--trained_checkpoint_dir=$MODELPATH \
--output_directory=$MODELPATH/tfliteexport

tflite_convert \
--saved_model_dir=$MODELPATH/tfliteexport/saved_model \
--output_file=$MODELPATH/tfliteexport/saved_model/model.tflite \
--input_shapes=1,320,320,3 \
--input_arrays=normalized_input_image_tensor \
--output_arrays='TFLite_Detection_PostProcess','TFLite_Detection_PostProcess:1','TFLite_Detection_PostProcess:2','TFLite_Detection_PostProcess:3' \
--inference_type=FLOAT --allow_custom_ops