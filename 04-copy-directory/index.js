const fs = require('fs');
const path = require('path');

function copyDir() {
  const pathName = path.join(__dirname, 'files-copy/');
  fs.rm(
    path.join(__dirname, 'files-copy/'),
    {
      recursive: true,
      force: true,
    },
    (err) => {
      if (err) console.log(err);
      fs.mkdir(pathName, { recursive: true }, (err) => {
        if (err) console.log(err);
        fs.readdir(path.join(__dirname, 'files'), (err, files) => {
          if (err) throw err;
          files.forEach((file) => {
            fs.copyFile(
              path.join(__dirname, 'files', file),
              path.join(pathName, file),
              (err) => {
                if (err) throw err;
              },
            );
          });
        });
      });
    },
  );
}

copyDir();
