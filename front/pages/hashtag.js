import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';

const Hashtag = ({ tag }) => {
  const dispatch = useDispatch();
  const { mainPosts, hasMorePost } = useSelector(state => state.post);
  const countRef = useRef([]);

  const onScroll = useCallback(() => {
    if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
      if (hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id;
        if (!countRef.current.includes(lastId)) {
          dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            data: tag,
            lastId,
          });
          countRef.current.push(lastId);
        }
      }
    }
  }, [hasMorePost, mainPosts.length, tag]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length]);

  return (
    <div>
      {mainPosts.map(c => (
        <PostCard key={c.id} post={c} />
      ))}
    </div>
  );
};

Hashtag.propTypes = {
  tag: PropTypes.string.isRequired,
};

// 서버쪽 데이터를 미리 데이터를 불러와서(didrendering 보다 먼저) 렌더링
Hashtag.getInitialProps = async (context) => {
  const { tag } = context.query;
  console.log('hashtag getInitialProps', tag);
  context.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    lastId: 0,
    data: tag,
  });
  return { tag };
};

export default Hashtag;
