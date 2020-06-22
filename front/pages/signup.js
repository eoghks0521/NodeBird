import React, { useState, useCallback, useEffect } from 'react';
import {
  Form, Input, Checkbox, Button,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { SIGN_UP_REQUEST } from '../reducers/user';

// 일반 컨포넌트를 Pure 컨포넌트로 바꾸어 퍼포먼스를 높혔다.
// const TextInput = memo(({ value, onChange }) => (
//   <Input name="user-id" value={value} required onChange={onChange} />
// ));

// 커스텀 훅
export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = useCallback((e) => {
    setter(e.target.value);
  }, []);
  return [value, handler];
};

const Signup = () => {
  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);
  const [id, onChangeId] = useInput('');
  const [nick, onChangeNick] = useInput('');
  const [password, onChangePassword] = useInput('');
  const dispatch = useDispatch();
  const { isSigningUp, me } = useSelector((state) => state.user);

  useEffect(() => {
    if (me) {
      alert('로그인했으니 메인페이지로 이동합니다.');
      Router.push('/');
    }
  }, [me && me.id]);// 비교 값으로 객체를 넣지마라, 객체는 언제든 undefined가 될 수 있으니 가드를 해야한다.

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        id,
        password,
        nick,
      },
    });
  }, [password, passwordCheck, term]);

  const onChangePasswordChk = useCallback((e) => {
    setPasswordError(e.target.value !== password);
    setPasswordCheck(e.target.value);
  }, [password]);
  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding: 10 }}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input name="user-nick" value={nick} required onChange={onChangeNick} />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-pass" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-pass-chk">비밀번호체크</label>
          <br />
          <Input
            name="user-pass-chk"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordChk}
          />
          {passwordError && <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>}
        </div>
        <div>
          <Checkbox name="user-term" value={term} onChange={onChangeTerm}>약관동의하세요.</Checkbox>
          {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={isSigningUp}>가입하기</Button>
        </div>
      </Form>
    </>
  );
};
export default Signup;
