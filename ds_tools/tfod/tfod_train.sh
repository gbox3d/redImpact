#!/bin/bash
TFODPATH=/home/gbox3d/tfod_models/research/object_detection
DSPATH=/home/gbox3d/work/dataset/handsign
MODELNAME=my_ssd_model

# python $TFODPATH/model_main_tf2.py --model_dir=$DSPATH/workspace/models/my_ssd_model --pipeline_config_path=$DSPATH/workspace/models//my_ssd_model/pipeline.config --alsologtostderr --num_train_steps=300

PIPELINE_CONFIG_PATH=$DSPATH/workspace/models//my_ssd_model/pipeline.config
MODEL_DIR=$DSPATH/workspace/models/my_ssd_model #훈련결과 출력 
NUM_TRAIN_STEPS=10000
SAMPLE_1_OF_N_EVAL_EXAMPLES=1

python $TFODPATH/model_main_tf2.py \
  --model_dir=$MODEL_DIR --num_train_steps=$NUM_TRAIN_STEPS \
  --sample_1_of_n_eval_examples=$SAMPLE_1_OF_N_EVAL_EXAMPLES \
  --pipeline_config_path=$PIPELINE_CONFIG_PATH \
  --alsologtostderr