import { RECEIVE_ENTRIES, ADD_ENTRY } from '../actions';

export function entries(state={}, action) {
  switch (action.type) {

    case RECEIVE_ENTRIES :
      return ({
        ...state,
        ...action.entries,
      });

    case ADD_ENTRY :
      return ({
        ...state,
        ...action.entry,
        // using spread on "entry" not required; future proofing in case add an additional key to the "entry"
      });

    default: return state;
  }
}

export default entries;
