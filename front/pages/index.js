import React from 'react';
import PostForm from '../components/PostForm'
import PostCard from '../components/PostCard'

const dummy = {
	isLoggedIn: true,
	mainPosts: [{
		User:{
			id: 1,
			nickname: '대환권'
		},
		content: '첫 번째 게시글',
		img: 'https://i.pinimg.com/236x/48/4d/42/484d428d49b8eacff392c46c4653233c.jpg'
	}],
	imagePaths: [],

};

const Home = () => {
	return (
		<div>
			{dummy.isLoggedIn && <PostForm/>}
			{dummy.mainPosts.map((c) => {
				return (
					<PostCard key={c} post={c}/>
				);
			})}
		</div>
	)
};

export default Home;
