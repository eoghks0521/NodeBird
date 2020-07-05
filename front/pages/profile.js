import React, { useCallback } from 'react';
import {
  Button, List, Card, Icon,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
// import {StopOutlined,} from '@ant-design/icons';
import NicknameEditForm from '../components/NicknameEditForm';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, UNFOLLOW_USER_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

const Profile = () => {
  const dispatch = useDispatch();
  const { followerList, followingList } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);
  const onUnfollow = useCallback(userId => () => {
    dispatch({
      type: UNFOLLOW_USER_REQUEST,
      data: userId,
    });
  }, []);
  const onRemoveFollower = useCallback(userId => () => {
    dispatch({
      type: REMOVE_FOLLOWER_REQUEST,
      data: userId,
    });
  }, []);
  return (
    <div>
      <NicknameEditForm />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>팔로잉 목록</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        bordered
        dataSource={followingList}
        renderItem={(item) => (
          <List.Item style={{ marginTop: '20px' }}>
            <Card actions={[<Icon type="stop" key="stop" onClick={onUnfollow(item.id)} />]}><Card.Meta description={item.nickname} /></Card>
          </List.Item>
        )}
    />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>팔로워 목록</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        bordered
        dataSource={followerList}
        renderItem={(item) => (
          <List.Item style={{ marginTop: '20px' }}>
            <Card actions={[<Icon type="stop" key="stop" onClick={onRemoveFollower(item.id)} />]}><Card.Meta description={item.nickname} /></Card>
          </List.Item>
        )}
    />
      <div>
        {mainPosts.map(c => (
          <PostCard key={+c.createdAt} post={c} />
        ))}
      </div>
    </div>
  );
};
Profile.getInitialProps = async (context) => {
  const state = context.store.getState();
  // 맨 먼저 LOAD_USERS_REQUEST가 app에서 실행되고 밑에가 실행됨
  context.store.dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_FOLLOWINGS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  // 하지만 아직 LOAD_USER_SUCCESS 전이기 때문에 me 존재 x
  // id 기본 값으로 0을 넣어서 0인 경우 자기 자신의 정보를 응답하도록 설정하여 문제 해결
};

export default Profile;
