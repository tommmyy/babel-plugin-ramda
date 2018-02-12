import {contains, merge} from 'ramda';
import fs from 'fs';
import Module from 'module';
import path from 'path';

function getDirectories(srcPath) {
  // Slow synchronous version of https://github.com/megawac/lodash-modularize/blob/master/src/lodashModules.js.
  // Using the paths lodash-cli provides is not an option as they may change version to version =(
  return ['.'].concat(fs.readdirSync(srcPath)).filter(filePath =>
    fs.statSync(path.join(srcPath, filePath)).isDirectory());
}

const _ramdaPath = path.dirname(Module._resolveFilename('ramda', merge(new Module, {
  'paths': Module._nodeModulePaths(process.cwd())
})));
const _ramdaExtPath = path.dirname(Module._resolveFilename('ramda-extension', merge(new Module, {
  'paths': Module._nodeModulePaths(process.cwd())
})));


// ramda folder will be /nodemodules/ramda/dist. We want to remove the dist
const ramdaPath = _ramdaPath.slice(0, _ramdaPath.lastIndexOf('ramda') + 5);
const ramdaExtPath = _ramdaPath.slice(0, _ramdaExtPath.lastIndexOf('ramda-extension') + 5)

var methods = {
  ramda: fs.readdirSync(path.join(ramdaPath, 'src'))
    .filter(name => path.extname(name) == '.js')
    .map(name => path.basename(name, '.js')),
  'ramda-extension': fs.readdirSync(path.join(ramdaExtPath, 'src'))
    .filter(name => path.extname(name) == '.js')
    .map(name => path.basename(name, '.js')),
};

export default function resolveModule(lib, name) {
  for (var category in methods[lib]) {
    if (contains(name, methods[lib])) {
      return `${lib}/src/${name}`;
    }
  }
  throw new Error(`${lib}'s method ${name} was not a known function
    Please file a bug if it's my fault https://github.com/tommmyy/babel-plugin-ramda-extension/issues
  `);
};
