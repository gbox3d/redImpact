#!/bin/bash
# cd ../../../yolov5
# YOLOV5_PATH=


# DS_PATH=/home/gbox3d/work/dataset/mecard2 
# PYTHONPATH=$YOLOV5_PATH python $YOLOV5_PATH/train.py --data ../dataset/test/data.yaml --cfg yolov5s.yaml --batch 16 --epoch 5 
TOOLPATH=/home/gbox3d/work/visionApp/daisy_project/detector/modules/yolov5
DSPATH=/home/gbox3d/work/dataset/handsign
MODELCONFIG=yolov5s.yaml
NUM_TRAIN_STEPS=1000
WEIGHT=""
GPU="0,1"
BATCH_SIZE=32
IMGSIZE=640

POSITIONAL=()
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
    -t|--toolPath)
      TOOLPATH="$2"
      shift # past argument
      shift # past value
      ;;
    -d|--dataSetPath)
      DSPATH="$2"
      shift # past argument
      shift # past value
      ;;
    -m|--modelConfig)
      MODELCONFIG="$2"
      shift # past argument
      shift # past value
      ;;
    -e|--epoch)
      NUM_TRAIN_STEPS="$2"
      shift # past argument
      shift # past value
      ;;
    -b|--batch)
      BATCH_SIZE="$2"
      shift # past argument
      shift # past value
      ;;
    -w|--weight)
      WEIGHT="$2"
      shift # past argument
      shift # past value
      ;;
    -g|--gpu)
      GPU="$2"
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

if [ "$WEIGHT" == "" ]; then
  CFGFILE=$DSPATH/../pre-trained-models/yolov5/$MODELCONFIG
else
  WEIGHT=$DSPATH/../pre-trained-models/yolov5/$WEIGHT
  CFGFILE=""
fi



echo 'tool path : '$TOOLPATH
# echo $MODELNAME
echo 'data set path : '$DSPATH
echo 'epoch count : '$NUM_TRAIN_STEPS
echo 'gpu select : '$GPU
echo 'weight file : '$WEIGHT
echo 'cfg file : ' $CFGFILE

cd $TOOLPATH

PYTHONPATH=./ python3 -m torch.distributed.run --nproc_per_node 2 train.py \
--data $DSPATH/data.yaml \
--cfg "$CFGFILE" \
--batch $BATCH_SIZE \
--epoch $NUM_TRAIN_STEPS \
--img $IMGSIZE \
--device $GPU \
--project $DSPATH/workspace/yolov5_train_jobs \
--name exp \
--weights "$WEIGHT"

# if ["$WEIGHT"=="none"]; then
#   PYTHONPATH=./ python train.py \
#   --data $DSPATH/data.yaml \
#   --cfg $DSPATH/../pre-trained-models/yolov5/$MODELNAME.yaml \
#   --batch $BATCH_SIZE \
#   --epoch $NUM_TRAIN_STEPS \
#   --img $IMGSIZE \
#   --device $GPU \
#   --project $DSPATH/workspace/yolov5_train_jobs \
#   --name exp
  
# else
  
# fi


echo '>>train ok.<<'
cd -



# python train.py \
# --data ~/work/dataset/madang_v2/data.yaml \
# --cfg ~/work/dataset/madang_v2/yolov5s.yaml \
# --img 640 --batch-size 32 --epochs 5000 \
# --project ~/work/dataset/madang_v2/jobs --name exp \
# --weights ''