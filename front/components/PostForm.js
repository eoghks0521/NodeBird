import React from 'react';
import {Button, Form, Input} from "antd";
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
const PostForm = () => {
	return (
		<Form style={{marginBottom: 20}} encType="multipart/form-data">
			<Input.TextArea maxLength={140} placeholder = "새 글을 써봐라" />
			<div>
				<input type="file" multiple hidden />
				<Button>이미지 업로드</Button>
				<Button type="primary" style={{ float: 'right' }} htmlType="submit">짹짹</Button>
			</div>
			<div>
				{dummy.imagePaths.map((v, i)=> {
					return (
						<div key={v} style = {{ display: 'inline-block'}}>
							<img src={'http://localhost:3065/' + v} style={{ width: '200px'}} alt={v} />
							<div>
								<Button>제거</Button>
							</div>
						</div>
					)
				})}
			</div>
		</Form>
	)
}
export default PostForm;
