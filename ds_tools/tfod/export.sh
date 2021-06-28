#!/bin/bash

# TFODPATH=/home/gbox3d/tfod_models/research/object_detection
# MODELPATH=/home/gbox3d/work/dataset/handsign/workspace/models/my_ssd_model

TFODPATH=$1
MODELPATH=$2

python $TFODPATH/exporter_main_v2.py  --input_type=image_tensor \
--pipeline_config_path=$MODELPATH/pipeline.config \
--trained_checkpoint_dir=$MODELPATH/ \
--output_directory=$MODELPATH/export