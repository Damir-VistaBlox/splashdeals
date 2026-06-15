const dictionaries = {
  rs: () => import('@/dictionaries/rs.json').then((module) => module.default),
};

/**
 * 🌍 Client-Safe Dictionary Loader
 * Resolves localized strings for use in Client Components.
 * Decoupled from server-only constraints for maximum interoperability.
 */
export const getClientDictionary = async () => {
  return dictionaries.rs();
};
