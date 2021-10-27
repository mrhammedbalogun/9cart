import { createContext } from 'react';
import React, { useReducer } from 'react';
export const initialState: any = {
  token: '',
  name: '',
};

//pure reducer function
export const tokenReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.token };
    case 'CLEAR_TOKEN':
      return { ...state, token: '' };
    case 'SET_NAME':
      return { ...state, name: action.name };
    default:
      return state;
  }
};
const TokenContext = createContext(initialState);

const TokenProvider = ({ children }: any) => {
  const [tokenState, tokenDispatcher] = useReducer(tokenReducer, initialState);

  return (
    <TokenContext.Provider value={[tokenState, tokenDispatcher]}>
      {children}
    </TokenContext.Provider>
  );
};

export { TokenContext, TokenProvider };
