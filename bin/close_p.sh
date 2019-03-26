#!/bin/bash

#echo "PID of this script: $$"
#echo "PPID of this script: $PPID"

ps -ef | grep $1 | grep -v "grep" | grep -v $0 | awk '{print $2}' | xargs kill -s 9
echo '删除'$1'所有进程成功';
