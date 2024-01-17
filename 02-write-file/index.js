const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'output.txt'));

stdout.write('Hello, please enter text: \n');

process.on('exit', () => {
  stdout.write('Goodbye!');
});

process.on('SIGINT', () => {
  process.exit();
});

stdin.on('data', (data) => {
  const stringifiedData = data.toString();
  if (stringifiedData.trim() === 'exit') {
    process.exit();
  } else {
    output.write(stringifiedData);
  }
});
