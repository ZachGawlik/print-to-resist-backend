# Print to Resist back end

Node, Express, MySQL back end for Print to Resist. Also see the [front end source](https://github.com/ZachGawlik/print-to-resist) and [live website](http://printtoresist.org/)

## Installation

1. Install MySQL and Node.js v7.7.0 or later
2. Clone the repository and `cd` into the project’s folder
3. Run `yarn` (or `npm install`) from the project directory to install the code’s dependencies
4. Create a local MySQL database by sequentially running through the sql scripts in the `migrations` folder
5. To connect the Node.js back end to your new local database, enter your `user` and `password` MySQL credentials in `config/configEXAMPLE.js` and rename the file to `config/config.js`.
6. Finally, run the server with `npm start`
