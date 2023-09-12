# Blackbox - FnO Trading Bot in TypeScript

Blackbox is a TypeScript-based trading bot designed primarily for Futures and Options (FnO) trading. It is extensible to other trading platforms, but currently, it is compatible with the Zerodha platform. The bot allows you to implement various trading strategies for automated trading. Please note that this repository is a work in progress, and most features are pending completion.

## Features

- **Order Manager**
  - [ ] Manage pending orders.
  - [ ] Retry orders with modification.
  - [ ] Cancel orders.
  - [ ] Blacklist orders for a specific duration.

- **App**
  - [ ] Check time and start/stop trading according to market hours.

- **Prisma**
  - [x] Pick stocks only from a specific strategy.

## Technologies Used

- TypeScript
- Node.js
- Prisma

## Installation

To set up the Blackbox trading bot, follow these steps:

1. Clone this repository to your local machine.

```bash
git clone https://github.com/yourusername/blackbox.git
```

2. Navigate to the project directory.

```bash
cd blackbox
```

3. Install the required dependencies.

```bash
npm install
```

4. Generate Prisma client code.

```bash
npm run g
```

## Usage

Here are some useful scripts that you can use:

- **Lint and Fix Code**

  ```bash
  npm run lint:fix
  ```

- **Format Code**

  ```bash
  npm run pretty
  ```

- **Start the Trading Bot**

  ```bash
  npm start
  ```

- **Build the Project**

  ```bash
  npm run build
  ```

- **Prisma Database Migrations**

  - Apply migrations without generating Prisma client code:

    ```bash
    npm run m
    ```

  - Generate Prisma client code:

    ```bash
    npm run g
    ```

  - Open Prisma Studio for database exploration:

    ```bash
    npm run s
    ```

## Contributing

Contributions to this project are welcome! Feel free to open issues or submit pull requests to help improve the trading bot.

## License

This project is licensed under the [MIT License](LICENSE).

---

Please make sure to update this README with additional information as the project evolves and more features are implemented. Include any setup instructions, configuration details, and usage examples that may be relevant to potential users and contributors.
