#!/bin/bash

clear
cd="$(cd)"
language=$2
user=$1
function lxc_check() {
    lxc-ls | grep -w $user
}
function lxc_start() {
        lxc-start -n $user -d
    echo "Started $user"
}
function lxc_init() {
   lxc-create -t ubuntu -n $user
}

if  lxc_check $user; then
        echo "exists"
        lxc_start
        if [ "$language" == "c" ]
        then
	#sudo lxc-clone -o ${user} -n u1
        cd /home/asim/project/tty.js/bin/

                echo "Done!!"
                sudo ./tty.js --port=3000

                echo "Running tty..."
        elif [ "$language" == "c++" ]
        then
                echo "$language"
        elif [ "$language" == "java" ]
        then
                echo "$language"
        else
        echo "ERROR."
        fi
 exit 1
        else
        echo "Not Exists"
        lxc_init
        echo 'Created...'
        sudo mksquashfs /var/lib/lxc/${user}/rootfs /var/lib/lxc/images/ubuntu.sqfs
        sudo mkdir /var/lib/lxc/${user}/rootfs.{rw,ro}
        sudo rm -rf /var/lib/lxc/${user}/rootfs/*
        sudo mount -t squashfs /var/lib/lxc/images/ubuntu.sqfs /var/lib/lxc/${user}/rootfs.ro

    # mount aufs on top of squashfs in rootfs
        sudo mount -t aufs -o br:/var/lib/lxc/${user}/rootfs.rw=rw:/var/lib/lxc/${user}/rootfs.ro=ro,xino=/dev/shm/ubuntu.xino none /var/lib/lxc/${user}/rootfs

	#sudo lxc-clone -o ${user} -n u1
        lxc_start
        #path=$(cat /var/lib/lxc/${user}/tmp_root_pass)
        #echo "${path}
        
        
	#sudo lxc-clone -o ${user} -n u1
	ip=$(sudo lxc-info -n ${user} -iH)
       # ip=$(sudo lxc-ls --fancy -F ipv4 ${user} | tail -1)
        echo ${ip}
        sshpass -p 'ubuntu' ssh-copy-id -o StrictHostKeyChecking=no ubuntu@${ip}
        
		cd /root/.ssh/
                scp authorized_keys ubuntu@${ip}:~/.ssh/
                echo "Key Pairing Done!!"
                ssh ubuntu@${ip}
		cd ~
                cd /home/asim/project/tty.js/bin/
                echo "Done!!"
                sudo ./tty.js --port=3000
                echo "Running tty..."

	 

    fi


