import createContext from "react-recontext";
import collections from "../class/collections";

export const { dispatch, Context, Provider } = createContext({
  displayName: 'AppContext',
  initState: {
    collections: {
      ...collections.get()
    },
    selection: []
  },
  actions: {
    SELECT_ANIME: (state, animeId) => {
      const selection = state.selection;
      if (!selection.includes(animeId)) {
        selection.push(animeId);
      }
      return {...state, selection: [...selection]}
    },
    TOGGLE_SELECTION: (state, animeId) => {
      let { selection } = state;

      if (selection.includes(animeId)) {
        selection = (selection as any[]).filter(id => id !== animeId);
      } else {
        selection.push(animeId);
      }

      return {...state, selection: [...selection]};
    },
    CLEAR_SELECTION: (state) => {
      return {...state, selection: []};
    },

    CREATE_COLLECTION: (state, name: string) => {
      return {...state, collections: { ...collections.create(name) }};
    },
    RENAME_COLLECTION: (state, { name, id }) => {
      return {...state, collections: { ...collections.rename(name, id) }};
    },
    DELETE_COLLECTION: (state, collectionId) => {
      return {...state, collections: { ...collections.delete(collectionId) }};
    },
    ADD_TO_COLLECTION: (state, {id, animeId}) => {
      return {...state, collections: { ...collections.addToCollections(animeId, id)}};
    },
    REMOVE_FROM_COLLECTION: (state, { animeId, collectionId }) => {
      return {...state, collections: {...collections.removeFromCollections(animeId, collectionId)}};
    }
  },
  isEnableLog: false
});
