#!/bin/bash

# 필요 모듈 
# pip install tensorflowjs

# TFODPATH=$1
MODELPATH=$1

# python $TFODPATH/exporter_main_v2.py  --input_type=image_tensor \
# --pipeline_config_path=$MODELPATH/pipeline.config \
# --trained_checkpoint_dir=$MODELPATH/ \
# --output_directory=$MODELPATH/export



tensorflowjs_converter \
--input_format=tf_saved_model \
--output_node_names='detection_boxes,detection_classes,detection_features,detection_multiclass_scores,detection_scores,num_detections,raw_detection_boxes,raw_detection_scores' \
--output_format=tfjs_graph_model \
--signature_name=serving_default \
$MODELPATH/export/saved_model \
$MODELPATH/tfjsexport