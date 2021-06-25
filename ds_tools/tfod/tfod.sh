#!/bin/bash
tool_path='/home/gbox3d/work/visionApp/redImpact/ds_tools/tfod'


python $tool_path/voc2tfod.py --dataset-path .

python $tool_path/gen_tfrecord.py -x ./train -l ./label_map.pbtext -o ./train.record
python $tool_path/gen_tfrecord.py -x ./valid -l ./label_map.pbtext -o ./valid.record

python $tool_path/update_config.py --data-file=/home/gbox3d/work/dataset/handsign/data.yaml