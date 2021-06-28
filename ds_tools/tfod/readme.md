## voc2tfod
usage sample<br> 
```sh
python voc2tfod.py --dataset-path ~/work/dataset/handsign
```

## gen_tfrecord

```sh
python gen_tfrecord.py -x ~/work/dataset/handsign/train -l ~/work/dataset/handsign/label_map.pbtext -o ~/work/dataset/handsign/train.reecord
```

## train

train.sh 스크립트 참고  

## export savedmodel

사용법 : export.sh tfodPath modelPath  

```sh
bash export.sh /home/gbox3d/tfod_models/research/object_detection /home/gbox3d/work/dataset/handsign/workspace/models/my_ssd_model
```