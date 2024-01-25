const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

async function createFolder() {
  try {
    await fsPromises.rm(
      path.join(__dirname, 'project-dist'),
      { recursive: true, force: true },
      (err) => {
        if (err) console.log(err);
      },
    );
    await fsPromises.mkdir(path.join(__dirname, 'project-dist'));
    await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets'));
  } catch (e) {
    console.log(e);
  }
}

function bundleCSS() {
  fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
    if (err) throw err;
    const styleFiles = files.filter((file) => path.extname(file) === '.css');
    fs.writeFile(
      path.join(__dirname, 'project-dist', 'style.css'),
      '',
      (err) => {
        if (err) console.error(err);
        const addToBundle = async (file) => {
          const input = await fsPromises.readFile(
            path.join(__dirname, 'styles', file),
            'utf8',
          );
          await fsPromises.appendFile(
            path.join(__dirname, 'project-dist', 'style.css'),
            input,
          );
        };
        styleFiles.forEach((file) => {
          addToBundle(file);
        });
      },
    );
  });
}

async function copyAssets() {
  const copy = async (src, dest) => {
    try {
      const list = await fsPromises.readdir(src);
      list.forEach((file) => {
        const check = async () => {
          const stat = await fsPromises.stat(path.join(src, file));
          if (stat.isFile()) {
            const input = await fsPromises.readFile(path.join(src, file));
            fs.writeFile(path.join(dest, file), input, (err) => {
              if (err) console.log(err);
            });
          } else if (stat.isDirectory()) {
            try {
              await fsPromises.mkdir(path.join(dest, file));
            } catch (err) {
              console.log('copying to existing directory');
            }
            await copy(path.join(src, file), path.join(dest, file));
          }
        };
        check();
      });
    } catch (err) {
      console.log(err);
    }
  };
  await copy(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets'),
  );
}

async function extractComponent(name) {
  try {
    const content = await fsPromises.readFile(
      path.join(__dirname, 'components', `${name}.html`),
      'utf8',
    );
    return content;
  } catch (err) {
    console.log(err);
  }
}

async function generateHTML() {
  try {
    const template = await fsPromises.readFile(
      path.join(__dirname, 'template.html'),
      'utf8',
    );

    const placeholders = [];
    template.replaceAll(/{{.*}}/g, (match) => {
      const componentName = match.split('').slice(2, -2).join('');
      placeholders.push(extractComponent(componentName));
      return match;
    });

    let output = await Promise.all(placeholders);
    const htmlBuild = template.replaceAll(/{{.*}}/g, () => {
      const content = output.shift();
      return content;
    });

    fs.writeFile(
      path.join(__dirname, 'project-dist', 'index.html'),
      htmlBuild,
      (err) => {
        if (err) {
          console.log(err);
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
}

async function createBundle() {
  await createFolder();
  bundleCSS();
  copyAssets();
  generateHTML();
}

createBundle();
