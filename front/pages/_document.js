import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Document, { NextScript, Main } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

// 이 부분은 함수 컨포넌트를 사용할 수 없다.
// head와 body 등등에 것들에 직접 속성값들을 넣어주기 위해 document를 사용한다.
// document를 사용하면 html 태그들을 다룰 수 있다.
class MyDocument extends Document {
  static getInitialProps(context) {
    const sheet = new ServerStyleSheet();
    const page = context.renderPage((App) => (props) => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    return { ...page, helmet: Helmet.renderStatic(), styleTags };
  }

  render() {
    const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
    const htmlAttrs = htmlAttributes.toComponent();
    const bodyAttrs = bodyAttributes.toComponent();
    return (
      <html {...htmlAttrs}>
        <head>
          {this.props.styleTags}
          {Object.values(helmet).map(el => el.toComponent())}
        </head>
        <body {...bodyAttrs}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.propTypes = {
  helmet: PropTypes.object.isRequired,
  styleTags: PropTypes.object.isRequired,
};
export default MyDocument;
