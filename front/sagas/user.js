import {
  all, fork, takeLatest, call, put, delay,
} from 'redux-saga/effects';
import axios from 'axios';
import {
  LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
  LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE,
  SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
  LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE,
} from '../reducers/user';

function logInAPI(loginData) {
  return axios.post('/user/login', loginData, {
    withCredentials: true, // 이걸 넣어야 쿠키를 주고 받을 수 있다.
  });
}
// call: 동기, fork: 비동기
function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
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

function logOutAPI() {
  return axios.post('/user/logout', {}, {
    withCredentials: true, // 쿠키를 도메인이 다른 서버에 보내주기 위한 설정
  });
}

function* logOut(action) {
  try {
    yield call(logOutAPI, action.data);
    yield put({ // Put은 dispatch
      type: LOG_OUT_SUCCESS,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_OUT_FAILURE,
      error: e,
    });
  }
}

function loadUserAPI() {
  return axios.get('/user/', {
    withCredentials: true,
  });
}

function* loadUser() {
  try {
    const result = yield call(loadUserAPI);
    yield put({ // Put은 dispatch
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
  ]);
}
