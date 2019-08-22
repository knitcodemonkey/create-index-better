import _ from 'lodash';

const safeVariableName = (fileName) => {
  const indexOfDot = fileName.indexOf('.');

  if (indexOfDot === -1) {
    return fileName;
  } else {
    return fileName.slice(0, indexOfDot);
  }
};

const buildExportBlock = (files) => {
  return files.map((fileName) => {
    return `
      export { default as ${safeVariableName(fileName)} } from './${fileName}';
      export * from './${fileName}';
    `.trim().split('\n').map((line) => {
      return line.trim();
    });
  }).reduce((a, b) => {
    return a.map((x, i) => x + '\n' + b[i]);
  }, ['', '']).join('').slice(1);
};

export default (filePaths, options = {}, initCode = '') => {
  let code;
  let configCode;

  code = initCode;
  configCode = '';

  if (options.banner) {
    const banners = _.isArray(options.banner) ? options.banner : [options.banner];

    banners.forEach((banner) => {
      code += banner + '\n';
    });

    code += '\n';
  }

  if (options.config && _.size(options.config) > 0) {
    configCode += ' ' + JSON.stringify(options.config);
  }

  code += '// @create-index' + configCode + '\n\n';

  if (filePaths.length) {
    const sortedFilePaths = filePaths.sort();

    code += buildExportBlock(sortedFilePaths) + '\n\n';
  }

  return code;
};
