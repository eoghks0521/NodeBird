export const initialState = {
	mainPosts: [{
		User: {
			id: 1,
			nickname: '제로초',
		},
		content: '첫 번째 게시글',
		img: '//post-phinf.pstatic.net/MjAxNzExMTVfODIg/MDAxNTEwNjc1MTUzMTgz.DI6A-lMO8Conr0PA5dLBGmiADloYAX2OSZs1IcOQcmMg.37fRGZKBR34LVL0F6RkKGWWx-ZgM97Je2ykPlY4mxeYg.JPEG/1.jpg?type=w800_q75',
	}],
	imagePaths: [],
};

const ADD_POST = 'ADD_POST';
const ADD_DUMMY = 'ADD_DUMMY';

const addPost = {
	type:ADD_POST,
};
const addDummy = {
	type:ADD_DUMMY,
	UserId: 1,
	User: {
		nickname: '대환권',
	}
};

const reducer = (state= initialState, action) => {
	switch (action.type) {
		case ADD_POST: {
			return {
				...state,
			};
		}
		case ADD_DUMMY: {
			return {
				...state,
				mainPosts: [action.data, ...state.mainPosts],
			};
		}
		default: {
			return{
				...state,
			};
		}
	}
}
export default reducer;
