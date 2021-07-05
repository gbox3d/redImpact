#!/bin/bash
# tool_path='/home/gbox3d/work/visionApp/redImpact/ds_tools/tfod'

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


python voc2tfod.py --dataset-path $DSPATH

python gen_tfrecord.py -x $DSPATH/train -l $DSPATH/workspace/label_map.pbtext -o $DSPATH/workspace/train.record
python gen_tfrecord.py -x $DSPATH/valid -l $DSPATH/workspace/label_map.pbtext -o $DSPATH/workspace/valid.record

# python $tool_path/update_config.py --data-file=/home/gbox3d/work/dataset/handsign/data.yaml