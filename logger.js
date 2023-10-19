const path = require('path');
const pino = require('pino');

const transport = pino.transport({
  target: 'pino/file',
  options: { destination: path.join(__dirname, 'errors.log') },
});
const logger = pino(transport);

module.exports = logger;
