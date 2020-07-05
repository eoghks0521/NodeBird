import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import axios from 'axios';

import rootSaga from '../sagas';
import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import { LOAD_USER_REQUEST } from '../reducers/user';

const NodeBird = ({ Component, store, pageProps }) => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Provider store={store}>
    <Head>
      <title>NodeBird</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
      <link rel="stylesheet" type="text/css" charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
      <link rel="stylesheet" type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
    </Head>
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  </Provider>
);

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
};

NodeBird.getInitialProps = async (context) => {
  const { ctx, Component } = context;
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  const state = ctx.store.getState();
  // 기존에 클라이언트에서 직접 서버에 요청을 보낼 때는 브라우저가 쿠키를 같이 넣어줌
  // 서버사이드렌더링에 경우 서버가 요청을 보내기 때문에(브라우저가 없음) 직접 쿠키를 넣어주어야 한다.
  // getInitialProps가 서버일 때도 실행되고 프런트일 때도 실행되기 때문에 분기처리가 필요하다.
  const { cookie } = ctx.isServer ? ctx.req.headers : '';
  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
  }
  return { pageProps };
};

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware, (store) => (next) => (action) => {
    console.log(action);
    next(action);
  }];
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(
      applyMiddleware(...middlewares),
    )
    : compose(
      applyMiddleware(...middlewares),
      !options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
    );
  const store = createStore(reducer, initialState, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga); // 서버사이드 렌더링을 위한 사가 미들웨어 실행부분
  return store;
};
export default withRedux(configureStore)(withReduxSaga(NodeBird));
