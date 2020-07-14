import React, { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../containers/PostForm';
import PostCard from '../containers/PostCard';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
  // user reducer로 설정해놓으면 user의 state가 바뀔 때 마다 전체가 리랜더링이 되므로
  // 속성들을 잘게 쪼개어 받으면 랜더링 최적화를 할 수 있다.
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const countRef = useRef([]);

  const onScroll = useCallback(() => {
    // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
    if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
      if (hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id;
        if (!countRef.current.includes(lastId)) {
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
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
  return (
    <div>
      {me && <PostForm />}
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </div>
  );
};

Home.getInitialProps = async (context) => {
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST,
  });
};

export default Home;
