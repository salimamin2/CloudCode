#!/bin/bash

#echo "Started"

user=$1
function lxc_check() {
    lxc-ls | grep -w $user
}
function lxc_start() {
        lxc-start -n $user -d
        #echo "Started $user"
}
function lxc_init() {
   lxc-create -t ubuntu -n $user
}

sudo lxc-clone -o ub2 -n ${user}

STATUS=""
#sudo lxc-info -n ${user} -sH
while [[ $STATUS -ne "STOPPED" ]]
do      
        STATUS=sudo lxc-info -n ${user} -sH
        sleep 2
done 
sleep 1
lxc_start

shpass -p 'ubuntu' ssh-copy-id -o StrictHostKeyChecking=no ubuntu@${ip}


#echo "Getting IP Address"
IP_ADDRESS=""
while [ "$IP_ADDRESS" ==  "" ]
do
        #IP=sudo lxc-info -n ${user} -iH
        #echo -ne "."
        
        IP_ADDRESS=$(sudo lxc-info -n ${user} -iH)
        
        #echo -ne "."
        #echo "Waiting for IP"
        
done 
echo ${IP_ADDRESS}

cd /home/asim/project/tty.js/bin/
sudo ./tty.js --port=3000

