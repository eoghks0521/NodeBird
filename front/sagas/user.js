import {
  all, fork, takeLatest, call, put, delay,
} from 'redux-saga/effects';
import axios from 'axios';
import {
  LOG_IN_REQUEST, LOG_IN_FAILURE, LOG_IN_SUCCESS, SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
} from '../reducers/user';

axios.defaults.baseURL = 'http://localhost:3065/api';

function loginAPI(loginData) {
  return axios.post('/user/login', loginData,{
    withCredentials: true, //이걸 넣어야 쿠키를 주고 받을 수 있다.
  });
}
// call: 동기, fork: 비동기
function* login(action) {
  try {
    const result = yield call(loginAPI, action.data);
    yield put({ // Put은 dispatch
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    });
  }
}

function signUpAPI(signUpData) {
  return axios.post('/user', signUpData);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data);
    yield put({ // Put은 dispatch
      type: SIGN_UP_SUCCESS,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: SIGN_UP_FAILURE,
      error: e,
    });
  }
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, login);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchSignUp),
  ]);
}
