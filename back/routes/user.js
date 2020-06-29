const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models');
const passport = require('passport');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  const user = Object.assign({}, req.user.toJSON());
  delete user.password;
  console.log(user);
  return res.json(user);
});
router.post('/', async(req, res, next) => {
  try{
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if(exUser) {
      return res.status(404).send('이미 사용중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });
    console.log(newUser);
    return res.status(200).json(newUser);
  }catch(e){
    console.error(e);
    //return res.status(403).send(e);
    //에러처리 여기서 -> 그냥 넘기면 에러가 그대로 노출된다.
    return next(e);
  }
});
router.get('/:id', async (req, res, next) => {
  try{
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
      include: [{
        model: db.Post,
        as: 'Posts',
        attributes: ['id'],
      }, {
        model: db.User,
        as: 'Followings',
        attributes: ['id'],
      }, {
        model: db.User,
        as: 'Followers',
        attributes: ['id'],
      }],
      attributes: ['id', 'nickname'],
    });
    const jsonUser = user.toJSON();
    jsonUser.Posts = jsonUser.Post ? jsonUser.Post.length: 0;
    jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length: 0;
    jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length: 0;
    res.json(jsonUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/hashtag/:name') //next 동적으로 와일드카드 값을 바꿀 수가 없다 따라서 next에 express를 연결시켜주어야함, 버전 9부터는 가능

router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('logout 성공');
});
router.post('/login', (req, res, next) => {
  //콜백 함수 인자로써 local 파일의 done에서 넣어준 값들이 들어온다.
  //카카오 네이버 로그인이면 그 전략 파일을 불러와라
  passport.authenticate('local', (err, user, info) => {
    if(err){
      console.error(err);
      return next(err);
    }
    if(info){
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        //얕은 복사
        const fullUser = await db.User.findOne({
          where: {id: user.id},
          include: [{
            model: db.Post,
            as: 'Posts', //associate에서 as를 넣어줬으면 똑같이 넣어주어야한다.
            attributes: ['id'],
          }, {
            model: db.User,
            as: 'Followings',
            attributes: ['id'],
          }, {
            model: db.User,
            as: 'Followers',
            attributes: ['id'],
          }],
          attributes: ['id', 'nickname', 'userId'],
        });
        console.log(fullUser);
        return res.json(fullUser);
      }catch (e) {
        next(e);
      }
    });
  })(req, res, next);
});


router.get('/:id/follow', (req, res) => {

});
router.post('/:id/follow', (req, res) => {

});
router.delete('/:id/follow', (req, res) => {

});
router.delete('/:id/follower', (req, res) => {

});
router.get('/:id/posts', async (req, res, next) => {
  try{
    const posts = await db.Post.findAll({
      where: {
        UserId: parseInt(req.params.id, 10),
        RetweetId: null,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.Image,
      }],
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
