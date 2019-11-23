import { createStore, applyMiddleware } from 'redux';

import middleware from './middleware';

const initState = {
  projects: [],
  requireLogin: false,
};

const reducer = (state = initState, action) => {
  const data = { ...state };
  switch (action.type) {
  case 'receiveData':
    data.projects = action.payload;
    break;
  case 'logout':
    localStorage.removeItem('accessToken');
    data.requireLogin = true;
    break;
  case 'login':
    localStorage.setItem('accessToken', action.payload);
    data.requireLogin = false;
    break;
  default:
    break;
  }
  return data;
};

export default createStore(reducer, {}, applyMiddleware(middleware));
