import { cp, copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesDirectory = path.join(projectRoot, 'src', 'pages');
const staticDirectory = path.join(projectRoot, 'src', 'static');
const outputDirectory = path.join(projectRoot, 'public');

await mkdir(outputDirectory, { recursive: true });

for (const entry of await readdir(pagesDirectory, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.html')) continue;

  const outputName = entry.name === 'not-found.html' ? '404.html' : entry.name;
  await copyFile(
    path.join(pagesDirectory, entry.name),
    path.join(outputDirectory, outputName)
  );
}

for (const directory of ['css', 'js']) {
  await cp(
    path.join(staticDirectory, directory),
    path.join(outputDirectory, directory),
    { recursive: true, force: true }
  );
}

await copyFile(
  path.join(staticDirectory, 'favicon.ico'),
  path.join(outputDirectory, 'favicon.ico')
);

console.log('Arquivos estáticos preparados na pasta public/.');
