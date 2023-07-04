import { aliasWebpack, aliasJest } from 'react-app-alias';

const aliasMap = {
  '@components': 'src/components',
  '@services': 'src/services',
  '@hooks': 'src/hooks',
  '@pages': 'src/pages',
  '@mocks': 'src/mocks',
  '@assets': 'src/assets',
  '@colors': 'src/colors',
  '@redux': 'src/redux-toolkit',
  '@root': 'src',
};

const options = {
  alias: aliasMap,
};

export default aliasWebpack(options);
export const jest = aliasJest(options);
