#!/bin/sh

### BEGIN INIT INFO
# Provides:          sakjmanage
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start daemon at boot time
# Description:       Enable service provided by daemon.
### END INIT INFO
# chkconfig: 345 88 08
# description: Forever for Node.js
 
BASH_HOME=/home/pi/sakj #基本目录

DEAMON=server.js   #这里需要填写你自己的Node项目的启动脚本文件
LOG=${BASH_HOME}/logs/forever.log  #可选，forever日志
OUTLOG=${BASH_HOME}/logs/info.log #可选，系统常规日志
ERRLOG=${BASH_HOME}/logs/error.log  #可选，系统错误日志
PID=${BASH_HOME}/logs/pid  #必填内容，用于记录forever的进程号

export PATH=${PATH}:/home/pi/node-v10.15.0-linux-armv7l/bin
 
#往下的内容就不用修改了

cd $BASH_HOME

if [ ! -f $LOG ]; then
    touch $LOG
fi

if [ ! -f $OUTLOG ]; then
    touch $OUTLOG
fi

if [ ! -f $ERRLOG ]; then
    touch $ERRLOG
fi

if [ ! -f $PID ]; then
    touch $PID
fi

node=node
forever=forever
 
case "$1" in
    start)
        $forever start -l $LOG -o $OUTLOG -e $ERRLOG --pidFile $PID -a $DEAMON
        ;;
    stop)
        $forever stop --pidFile $PID $DEAMON
        ;;
    stopall)
        $forever stopall --pidFile $PID
        ;;
    restartall)
        $forever restartall --pidFile $PID
        ;;
    reload|restart)
        $forever restart -l $LOG -o $OUTLOG -e $ERRLOG --pidFile $PID -a $DEAMON
        ;;
    list)
        $forever list
        ;;
    *)
        echo "Usage: /etc.init.d/node {start|stop|restart|reload|stopall|restartall|list}"
        exit 1
        ;;
esac
