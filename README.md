# Express.js + TypeScript + MongoDB Starter

A boilerplate project to get you started with building scalable and maintainable Node.js applications using **Express.js**, **TypeScript**, and **MongoDB**.

## Features

- 🚀 **Quick Setup**: Get your backend project up and running in no time.
- 📚 **Learn by Example**: A well-structured codebase to help beginners understand best practices.
- ⚡ **TypeScript Ready**: Modern JavaScript with static typing for better code quality.
- 🗄️ **MongoDB Integration**: Preconfigured connection and basic CRUD operations.
- 🧩 **Modular Architecture**: Clean, scalable project structure.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rawbinn/express-typescript-mongodb-starter.git
   cd express-typescript-mongodb-starter
   ```

2. Install dependencies:
    ```
    npm install
    # or
    yarn install
    ```

3. Create a .env file in the root directory and add your configuration:
    ```
    PORT=3000
    MONGO_PATH=mongodb://localhost:27017/your-database-name
    ```
    
4. Start the development server:
    ```
    npm run dev
    # or
    yarn dev
    ```
## Environment
To edit environment variables, create a file with name `.env` and copy the contents from `.env.sample` to start with.

| Var Name  | Type  | Default | Description  |
|---|---|---|---|
| NODE_ENV  | string  | `development` |API runtime environment. eg: `production`  |
|  PORT | number  | `3000` | Port to run the API server on |
|  MONGO_PATH | string  | `mongodb://localhost:27017/your-databse-name` | URL for MongoDB |
|  ACCESS_TOKEN_SECRET | string  | `secret` | JWT Token's Secret Key |


### Issues
If you come across any issues please [report them here](https://github.com/rawbinn/Express.js-TypeScript-MongoDB-Starter/issues).

### Contribution
Contributions are welcome! If you’d like to improve the project or add features please feel free to make any pull requests.

### License
This project is licensed under the [MIT](LICENSE) License.