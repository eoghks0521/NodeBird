import React, {useEffect} from 'react';
import PostForm from '../components/PostForm'
import PostCard from '../components/PostCard'
import {useDispatch, useSelector} from "react-redux";
import {LOG_IN, loginAction, logoutAction} from '../reducers/user';

const Home = () => {
	const user = useSelector(state => state.user.user);
	//user reducer로 설정해놓으면 user의 state가 바뀔 때 마다 전체가 리랜더링이 되므로
	//속성들을 잘게 쪼개어 받으면 랜더링 최적화를 할 수 있다.
	const isLoggedIn = useSelector(state => state.user.isLoggedIn);
	const { mainPosts }  = useSelector(state => state.post);
	return (
		<div>
			{user ? <div>로그인 했습니다: {user.nickname}</div> : <div>로그아웃 했습니다.</div>}
			{isLoggedIn && <PostForm/>}
			{mainPosts.map((c) => {
				return (
					<PostCard key={c} post={c}/>
				);
			})}
		</div>
	)
};

export default Home;
