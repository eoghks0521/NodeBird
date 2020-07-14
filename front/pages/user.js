import React, { useEffect, useCallback, useRef } from 'react';
import PropsTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Card } from 'antd';
import PostCard from '../containers/PostCard';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';

// props는 getIntialProps에서 return 하면 들어온다.
const User = ({ id }) => {
  const { mainPosts, hasMorePost } = useSelector((state) => state.post);
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const countRef = useRef([]);

  const onScroll = useCallback(() => {
    if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
      if (hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id;
        if (!countRef.current.includes(lastId)) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId,
            data: id,
          });
          countRef.current.push(lastId);
        }
      }
    }
  }, [hasMorePost, mainPosts.length, id]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length]);

  return (
    <div>
      {userInfo
        ? (
          <Card
            actions={[
              <div key="twit">
                짹짹
                <br />
                {userInfo.Posts}
              </div>,
              <div key="followings">
                팔로잉
                <br />
                {userInfo.Followings}
              </div>,
              <div key="followers">
                팔로워
                <br />
                {userInfo.Followers}
              </div>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
              title={userInfo.nickname}
            />
          </Card>
        )
        : null}
      {mainPosts.map(c => (
        <PostCard key={c.id} post={c} />
      ))}
    </div>
  );
};

User.propTypes = {
  id: PropsTypes.number.isRequired,
};

User.getInitialProps = async (context) => {
  const { id } = context.query;
  console.log('hashtag getInitialProps', id);
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    lastId: 0,
    data: id,
  });
  return { id };
};
export default User;
