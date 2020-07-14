import React, { useCallback, useRef, useEffect } from 'react';
import {
  Button, List, Card, Icon,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
// import {StopOutlined,} from '@ant-design/icons';
import NicknameEditForm from '../containers/NicknameEditForm';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, UNFOLLOW_USER_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';

const Profile = () => {
  const dispatch = useDispatch();
  const {
    followerList, followingList, hasMoreFollower, hasMoreFollowing,
  } = useSelector(state => state.user);
  const { mainPosts, hasMorePost } = useSelector(state => state.post);
  const countRef = useRef([]);

  const onScroll = useCallback(() => {
    if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
      if (hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id;
        if (!countRef.current.includes(lastId)) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId,
          });
          countRef.current.push(lastId);
        }
      }
    }
  }, [hasMorePost, mainPosts.length]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length]);

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
  const loadMoreFollowings = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
      offset: followingList.length,
    });
  }, [followingList.length]);
  const loadMoreFollowers = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
      offset: followingList.length,
    });
  }, [followingList.length]);

  return (
    <div>
      <NicknameEditForm />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>팔로잉 목록</div>}
        loadMore={hasMoreFollowing && <Button style={{ width: '100%' }} onClick={loadMoreFollowings}>더 보기</Button>}
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
        loadMore={hasMoreFollower && <Button style={{ width: '100%' }} onClick={loadMoreFollowers}>더 보기</Button>}
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
    lastId: 0,
    data: state.user.me && state.user.me.id,
  });
  // 하지만 아직 LOAD_USER_SUCCESS 전이기 때문에 me 존재 x
  // id 기본 값으로 0을 넣어서 0인 경우 자기 자신의 정보를 응답하도록 설정하여 문제 해결
};

export default Profile;
