import 'server-only';

const dictionaries = {
  rs: () => import('../dictionaries/rs.json').then((module) => module.default),
};

export const getDictionary = async () => {
  'use cache'
  return dictionaries.rs();
};
