#!/bin/bash
#argument paring refer
#https://stackoverflow.com/questions/192249/how-do-i-parse-command-line-arguments-in-bash


#defualt value
TFODPATH=/home/gbox3d/tfod_models/research/object_detection
DSPATH=/home/gbox3d/work/dataset/handsign
MODELNAME=my_ssd_model
NUM_TRAIN_STEPS=1000


POSITIONAL=()
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
    -t|--tfodPath)
      TFODPATH="$2"
      shift # past argument
      shift # past value
      ;;
    -d|--dataSetPath)
      DSPATH="$2"
      shift # past argument
      shift # past value
      ;;
    -m|--model)
      MODELNAME="$2"
      shift # past argument
      shift # past value
      ;;
    -e|--epoch)
      NUM_TRAIN_STEPS="$2"
      shift # past argument
      shift # past value
      ;;
    
    --default)
      DEFAULT=YES
      shift # past argument
      ;;
    *)    # unknown option
      POSITIONAL+=("$1") # save it in an array for later
      shift # past argument
      ;;
  esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

echo $TFODPATH
echo $MODELNAME
echo $DSPATH
echo $NUM_TRAIN_STEPS


# python $TFODPATH/model_main_tf2.py --model_dir=$DSPATH/workspace/models/my_ssd_model --pipeline_config_path=$DSPATH/workspace/models//my_ssd_model/pipeline.config --alsologtostderr --num_train_steps=300

PIPELINE_CONFIG_PATH=$DSPATH/workspace/models//$MODELNAME/pipeline.config
MODEL_DIR=$DSPATH/workspace/models/$MODELNAME #훈련결과 출력 
# NUM_TRAIN_STEPS=1000000
SAMPLE_1_OF_N_EVAL_EXAMPLES=1

#multi gpu
#https://stackoverflow.com/questions/40069883/how-to-set-specific-gpu-in-tensorflow
#tfod 는 기본적으로 멀티 gpu를 사용한다. pipeline_config에서  batch_size로 지정해준 값은 gpu당 싸이즈이다.
#CUDA_VISIBLE_DEVICES="0,1" python $TFODPATH/model_main_tf2.py \

python $TFODPATH/model_main_tf2.py \
  --model_dir=$MODEL_DIR --num_train_steps=$NUM_TRAIN_STEPS \
  --sample_1_of_n_eval_examples=$SAMPLE_1_OF_N_EVAL_EXAMPLES \
  --pipeline_config_path=$PIPELINE_CONFIG_PATH \
  --alsologtostderr

echo "done."