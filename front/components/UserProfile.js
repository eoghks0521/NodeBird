import React, {useCallback} from 'react';
import {Avatar, Button, Card} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {logoutAction} from "../reducers/user";

const UserProfile = () => {
	const { user } = useSelector(state=>state.user);
	const dispatch = useDispatch();
	//자식 컨포넌트의 props로 전달하기 때문이다.
	const onLogout = useCallback(() => {
		dispatch(logoutAction);
	},[]);
	return (
		<Card
			actions={[
				<div key="twit">짹짹<br/>{user.Post.length}</div>,
				<div key="twit">팔로잉<br/>{user.Followings.length}</div>,
				<div key="twit">팔로워<br/>{user.Followers.length}</div>
			]}>
			<Card.Meta
				avatar={<Avatar>{user.nickname[0]}</Avatar>}
				title={user.nickname}
			/>
			<Button onClick={onLogout}>로그아웃</Button>
		</Card>
	);
};
export default UserProfile;
