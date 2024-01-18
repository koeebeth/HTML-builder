const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) throw err;
  const styleFiles = files.filter((file) => path.extname(file) === '.css');
  fs.writeFile(
    path.join(__dirname, 'project-dist', 'bundle.css'),
    '',
    (err) => {
      if (err) console.error(err);
      const addToBundle = async (file) => {
        const input = await fsPromises.readFile(
          path.join(__dirname, 'styles', file),
          'utf8',
        );
        await fsPromises.appendFile(
          path.join(__dirname, 'project-dist', 'bundle.css'),
          input,
        );
      };
      styleFiles.forEach((file) => {
        addToBundle(file);
      });
    },
  );
});
