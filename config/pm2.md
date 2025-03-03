# Installing PM2 on Ubuntu

Follow these steps to install PM2, a process manager for Node.js applications, on Ubuntu:

## 1. Update Your Package List
Update your package list to ensure you can access the latest versions of the packages. Run this command in the terminal:
```bash
sudo apt update
```

## 2. Install Node.js
PM2 is a Node.js application, so Node.js needs to be installed. If it's not already installed, you can do so using this command:
```bash
sudo apt install nodejs npm
```
This will install both Node.js and npm (Node Package Manager).

## 3. Install PM2
Install PM2 globally using npm with the following command:
```bash
sudo npm install pm2@latest -g
```
The `-g` flag installs PM2 globally, allowing it to be run from anywhere on your system.

## 4. Check PM2 Version
Verify the installation and check the version of PM2 with this command:
```bash
pm2 -v
```

## 5. Start Using PM2
To start a Node.js application with PM2, navigate to your application's directory and run:
```bash
pm2 start app.js
```
Replace `app.js` with your application's entry point file.

## 6. Set PM2 to Automatically Resurrect
To set up PM2 to automatically restart your applications on system reboot, use its startup script feature:
```bash
pm2 startup systemd
```
Then, follow the on-screen instructions to copy and paste the generated command back into your terminal.

By following these steps, PM2 will be installed and configured to manage your Node.js applications on Ubuntu.
