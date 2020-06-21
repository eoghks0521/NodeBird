import React from 'react';
import { useSelector } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const Home = () => {
  // user reducer로 설정해놓으면 user의 state가 바뀔 때 마다 전체가 리랜더링이 되므로
  // 속성들을 잘게 쪼개어 받으면 랜더링 최적화를 할 수 있다.
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const { mainPosts } = useSelector((state) => state.post);
  return (
    <div>
      {isLoggedIn && <PostForm />}
      {mainPosts.map((c) => (
        <PostCard key={c} post={c} />
      ))}
    </div>
  );
};

export default Home;
