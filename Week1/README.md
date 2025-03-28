# Project Setup Instructions

Before running the project, make sure you have **Node.js** installed. Then, install the necessary dependencies:

### Install dependencies:
```bash
npm install express
npm install dotenv
npm install nodemon
```
make a local .env file and put your own API key

it should look like the .env_sample file

then run:
```bash
nodemon server.js
```
*DO NOT UPLOAD YOUR .env FILE TO GITHUB*

Instead, make a .gitignore file and list your .env file in it (look at my .gitignore for reference)