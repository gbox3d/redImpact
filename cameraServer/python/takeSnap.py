import sys
import time
from datetime import datetime
from time import sleep

from picamera import PiCamera

print(sys.version)
print(sys.argv)
print(len(sys.argv))


camera = PiCamera()
#v2 3280x2464
#v1 2592x1944
# camera.resolution = (640, 480)
_width = 3280
_height = 2464
if len(sys.argv) == 3 :
    _width = int(sys.argv[1])
    _height = int(sys.argv[2])

print(f'take {_width} , {_height}')
camera.resolution = (_width, _height)


camera.start_preview()
# Camera warm-up time
sleep(2)
print("capturing....")

filename = f'../../../../Public/capture_{int(time.mktime(datetime.now().timetuple()))}.jpg'
camera.capture(filename)

print('save ok ',filename)
