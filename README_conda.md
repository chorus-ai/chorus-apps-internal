
# Installing Conda on Ubuntu

This guide will walk you through the installation of Conda on Ubuntu. 

## Step 1: Update Your System

Before installing any new software, it's a good idea to update your system's package list and upgrade all your existing packages. Open a terminal and run:

```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2: Download Miniconda Installer

You can download the Miniconda installer script from the official Conda website. Choose the installer that matches your system's architecture (usually 64-bit). Run the following command in the terminal:

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
```

## Step 3: Run the Installer

After downloading, run the installer script:

```bash
bash Miniconda3-latest-Linux-x86_64.sh
```

Follow the on-screen prompts to complete the installation. Be sure to agree to the license terms and specify the installation path.

## Step 4: Initialize Conda

Once the installation is complete, you need to initialize Conda to integrate it with your shell (bash, zsh, etc.):

```bash
source ~/miniconda3/bin/activate
conda init
```

This step will modify your shell script files like `.bashrc` or `.zshrc` to initialize Conda whenever you open a new terminal.

## Step 5: Create a New Conda Environment

With Conda installed, you can create a new environment. For example, to create an environment with Python 3.9, run:

```bash
conda create --name chorusenv python=3.9
```

Activate your new environment with:

```bash
conda activate chorusenv
```

## Step 6: Install Additional Packages

You can install additional packages using Conda. For instance, to install NumPy, run:

```bash
conda install numpy
```

## Step 7: Update Conda

Keep your Conda up to date with:

```bash
conda update conda
```
