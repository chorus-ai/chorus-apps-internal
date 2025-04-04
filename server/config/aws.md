# Getting Started with Apps on AWS Linux 2

## Prepare Node enviroment in AWS

Install nodejs version 16

```
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
```

Install git and pull the repo

```
sudo yum install -y git
git clone https://github.com/...
```

Generating a new SSH key in AWS

https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

Create a service file to keep the app running

```sh
sudo vim /etc/systemd/system/NodeServer.service
```

```sh
[Unit]
Description=My Node Server
After=multi-user.target

[Service]
ExecStart=/usr/bin/node /home/ec2-user/lotr/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=my-node-server
User=ec2-user
EnvironmentFile=/home/ec2-user/lotr/app.env

[Install]
WantedBy=multi-user.target
```

Start the service

```sh
sudo systemctl enable NodeServer.service
sudo systemctl start NodeServer.service
```

```
# Install Nginx
sudo amazon-linux-extras install nginx1

# Start Nginx:-
sudo service nginx start
sudo systemctl start nginx

# Stop Nginx:-
sudo service nginx stop
sudo systemctl stop nginx

# Restart Nginx:-
service nginx restart
systemctl restart nginx

# Reload Nginx:-
service nginx reload
systemctl reload nginx

# Status Nginx:-
service nginx status
systemctl status nginx

# Test Nginx Configuration:-
sudo nginx -t
service nginx configtest

```

Install Pm2 and Sequelize-cli globally

```
sudo npm install -g pm2
sudo npm install -g sequelize-cli

```

Create a key, a CSR, and then sign the CSR in AWS

```
cd /etc/pki/tls/private
sudo openssl genrsa -out ssl-client.key 2048
sudo openssl req -new -sha256 -key ssl-client.key -out ssl-client.csr

Country Name (2 letter code) [XX]:US
State or Province Name (full name) []:Georgia
Locality Name (eg, city) [Default City]:Atlanta
Organization Name (eg, company) [Default Company Ltd]:Emory University
Organizational Unit Name (eg, section) []:School of Nursing
Common Name (eg, your name or your server's hostname) []:https://nursingdatascience.emory.edu
Email Address []:
A challenge password []:
An optional company name []:

```

## Redis instruction for AWS


To install Redis on Amazon Linux 2, you can follow these steps:

1. Update the system packages:
```
sudo yum update -y
```
2. Install the Redis package using the Amazon Linux Extra Packages for Enterprise Linux (EPEL) repository:
```
sudo amazon-linux-extras install epel
sudo amazon-linux-extras install redis6
```
3. Start the Redis service:
```
sudo systemctl start redis
```
4. Enable Redis to start automatically at boot time:
```
sudo systemctl enable redis
```
5. Verify the Redis installation by checking its version:
```
redis-server --version
```

## Conda instruction for AWS 


We assume you are running an Amazon Linux AMI and have root access. Now, Install python by following commands:

```
yum install python3 -y
```
Before installing Anaconda make sure all packages are installed on your Linux ec2 environment
```
yum install libXcomposite libXcursor libXi libXtst libXrandr alsa-lib mesa-libEGL libXdamage mesa-libGL libXScrnSaver -y  
```
Ok perfect, Now let install Anaconda on Amazon Linux (Ec2)
```
wget https://repo.anaconda.com/archive/Anaconda3-2020.02-Linux-x86_64.sh
```
More information please visit this link

After download run the downloaded script
```
sh Anaconda3-2020.02-Linux-x86_64.sh
```
Just following the above script and press “enter” you will get Anaconda to install location


Use the following command to activate the installation
```
$ source ~/.bashrc
```

## Git clone instruction for AWS 

```
git clone https://github.com/hulab-emory/hulab-apps.git
```
username: YOUR_GIT_USERNAME

password: PERSONAL_ACCESS_TOKEN

```
cd hulab-apps
git checkout develop

npm install
npm run build

pm2 start server.js
pm2 start worker.js
```

### To load starter data
Run command:

```
npx sequelize-cli db:seed:all
```

## To resize EC2 storage volume 

Go to AWS console and change the volume, then follow 
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html
```
sudo growpart /dev/xvda 1
sudo lsblk
sudo xfs_growfs /dev/xvda1
df -hT #check the changes in volume
```
