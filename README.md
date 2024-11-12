# Quick start

<figure><img src=".gitbook/assets/CHoRUS Cloud App Architecture (2).jpg" alt=""><figcaption><p>CHoRUS Apps Architecture</p></figcaption></figure>

### Prerequisites

* [ ] Install necessary software
* [ ] Set up the environment
* [ ] Review system requirements

### Installation

Here’s how to install **Node.js** and **npm** on your machine.

#### Step 1: Download Node.js

1. Visit the [Node.js official website](https://nodejs.org/).
2. Choose the **LTS (Long-Term Support)** version for stability.
3. Download and run the installer for your operating system.

#### Step 2: Install Node.js

* **macOS/Linux**:
  *   Open a Terminal and run:

      ```bash
      # Update your package list
      sudo apt update   # For Linux
      # Install Node.js and npm
      sudo apt install -y nodejs npm
      ```
* **Windows**:
  * Run the downloaded installer and follow the prompts to complete the installation.

#### Step 3: Verify the Installation

After installation, open your command line interface (Terminal on macOS/Linux or Command Prompt on Windows) and run the following commands to verify that Node.js and npm were installed correctly:

```bash
node -v   # Checks Node.js version
npm -v    # Checks npm version
```

If the versions display successfully, both **Node.js** and **npm** are installed and ready to use!

Then, install remaining libraries: [Redis](https://redis.io/docs/latest/operate/oss\_and\_stack/install/install-redis/install-redis-on-linux/), [PM2](https://www.npmjs.com/package/pm2), [MUI](https://mui.com/material-ui/getting-started/installation/) and [ExpressJs](https://www.npmjs.com/package/express).&#x20;

### Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch`
3. Make changes and commit: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-branch`
5. Open a pull request

### License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the LICENSE file for more details.
