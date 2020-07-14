import React, { useCallback } from 'react';
import { Avatar, Button, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { LOG_OUT_REQUEST } from '../reducers/user';

const UserProfile = () => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // 자식 컨포넌트의 props로 전달하기 때문이다.
  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);
  return (
    <Card
      actions={[
        <Link href="/profile" key="twit"><a><div>짹짹<br />{me.Posts.length}</div></a></Link>,
        <Link href="/profile" key="following"><a><div>팔로잉<br />{me.Followings.length}</div></a></Link>,
        <Link href="/profile" key="follwer"><a><div>팔로워<br />{me.Followers.length}</div></a></Link>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};
export default UserProfile;
