import React, { useCallback } from 'react';
import Link from 'next/link';
import {
  Input, Menu, Row, Col,
} from 'antd';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  // const [searchInput, onChangeSearchInput] = useInput('');

  const onSearch = useCallback((value) => {
    // 실제 서버 주소와 내부서버 주소가 다르기 때문에 3번째 인자로 보여지는 주소를 넣어주어야한다.
    Router.push({ pathname: '/hashtage', query: { tag: value } }, `/hashtag/${value}`);
  }, []);
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
        <Menu.Item key="mail">
          <Input.Search
            enterButton
            style={{ verticalAlign: 'middle' }}
            // onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
        </Menu.Item>
      </Menu>

      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me
            ? <UserProfile />
            : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <Link href="//github.com/eoghks0521"><a target="_black">Made by bigring</a></Link>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};
export default AppLayout;
