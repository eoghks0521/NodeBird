import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import {Form, Input, Checkbox , Button} from 'antd';
const Signup = () =>{

	const [passwordCheck, setPasswordCheck] = useState('');
	const [term, setTerm] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [termError, setTermError] = useState(false);

	const onSubmit = () => {
		if(password !== passwordCheck){
			return setPasswordError(true);
		}
		if(!term){
			return setTermError(true);
		}
		console.log({
			id,
			nick,
			password,
			passwordCheck,
			term,
		})
	};
	const onChangePasswordChk = (e) => {
		setPasswordError(e.target.value !== password);
		setPasswordCheck(e.target.value);
	};
	const onChangeTerm = (e) =>{
		setTermError(false);
		setTerm(e.target.checked);
	};

	//커스텀 훅
	const useInput = (initValue = null) => {
		const [value, setter] = useState(initValue);
		const handler = (e) => {
			setter(e.target.value);
		};
		return [value, handler];
	}
	const [id, onChangeId] = useInput('');
	const [nick, onChangeNick] = useInput('');
	const [password, onChangePassword] = useInput('');
	return <>
			<Head>
				<title>NodeBird</title>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"/>
			</Head>
			<AppLayout>
				<Form onFinish={onSubmit} style={{ padding: 10}}>
					<div>
						<label htmlFor="user-id">아이디</label>
						<br/>
						<Input name="user-id" value={id} required onChange={onChangeId} />
					</div>
					<div>
						<label htmlFor="user-nick">닉네임</label>
						<br/>
						<Input name="user-nick" value={nick} required onChange={onChangeNick} />
					</div>
					<div>
						<label htmlFor="user-pass">비밀번호</label>
						<br/>
						<Input name="user-pass" type="password" value={password} required onChange={onChangePassword} />
					</div>
					<div>
						<label htmlFor="user-pass-chk">비밀번호체크</label>
						<br/>
						<Input name="user-pass-chk" type="password" value={passwordCheck} required onChange={onChangePasswordChk} />
						{passwordError && <div style={{color:'red'}}>비밀번호가 일치하지 않습니다.</div>}
					</div>
					<div>
						<Checkbox name= "user-term" value={term} onChange={onChangeTerm}>약관동의하세요.</Checkbox>
						{termError && <div style={{color:'red'}}>약관에 동의하셔야 합니다.</div>}
					</div>
					<div style={{marginTop:10}}>
						<Button type="primary" htmlType="submit">가입하기</Button>
					</div>
				</Form>
			</AppLayout>
	</>

}
export default Signup;
