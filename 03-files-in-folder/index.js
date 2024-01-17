const fs = require('fs');
const path = require('path');
const { stdout } = process;

fs.readdir(path.join(__dirname, 'secret-folder/'), (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    fs.stat(path.join(__dirname, 'secret-folder/', file), (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        const extension = path.extname(file).split('').slice(1).join('');
        const fileSize = stats.size / 1000;
        const fileName = file.split('.').slice(0, -1).join('.');
        stdout.write(`${fileName} - ${extension} - ${fileSize}kB\n`);
      }
    });
  });
});
