const express = require('express');
const morgan = require('morgan');
const db = require('./models');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
//현재 로그인한 유저 찾기, 클라이언트엔 쿠키 서버엔 세션 설정
const passport = require('passport');

const passportConfig = require('./passport');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();

//요청과 응답을 중간에서 변화시켜주는 것을 미들웨어
app.use(morgan('dev'));
//경로를 지정해주면 그안에 있느 파일들을 다른 서버에서 사용할 수 있게 해준다. 밑 코드는 uploads 폴더를 루트 폴더인 마냥 사용할 수 있게한다.
app.use('/', express.static('uploads'));
app.use(cors({
  //이 두개를 true를 줘야 쿠키를 줄 수 있다. 도메인이 같으면 필요 없음.
  origin: true,
  credentials: true, //이 부분은 클라이언트랑 서버랑 둘 다 설정해주어야한다.
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  //자바스크립트로 쿠키 접근 금지 설정
  cookie:{
    httpOnly: true,
    secure: false, //https를 쓸 때 true;
  },
  name: 'bigrings',
}));
// passport session이 expressSession을 내부적으로 사용하기 때문에 실행 위치를 expressSession 밑에 두어야한다.
app.use(passport.initialize());
app.use(passport.session());
//밑에 2줄을 추가해야 res.body...;이런 코드가 정상적으로 작동한다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);

app.listen(3065, () =>{
  console.log('server is running on http://localhost:3065');
});
