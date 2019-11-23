import axios from 'axios';

export default (store) => (dispatch) => (action) => {
  dispatch(action);
  switch (action.type) {
  case 'getData':
    axios.get('/api/list')
      .then((res) => {
        dispatch({
          type: 'receiveData',
          payload: res.data,
        });
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          dispatch({
            type: 'logout',
            payload: err,
          });
        }
      });
    break;
  default:
    break;
  }
};
