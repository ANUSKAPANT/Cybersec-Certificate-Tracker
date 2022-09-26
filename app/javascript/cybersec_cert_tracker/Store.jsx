import React, {useContext, useReducer, createContext} from 'react';
import PropTypes from 'prop-types';

export const useStoreContext = () => useContext(Store);

const initialState = {
  userData: {},
  notificationRef: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER_DATA':
      return { ...state, userData: action.payload };
    case 'SET_NOTIFICATION_REF':
      return { ...state, notificationRef: action.payload };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [globalState, dispatch] = useReducer(reducer, initialState);
  const value = { globalState, dispatch };
  const { children } = props;

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}

const Store = createContext();
export default Store;

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
