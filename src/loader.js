import {getOptions} from 'loader-utils';

export default (source) => {
  const options = getOptions(source);
  return `module.exports = \`${source}\`;`;
};
