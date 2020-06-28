const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
  if(!req.user){// deserialsize가 req.user를 만들어줌
    return res.status(401).send('로그인이 필요함니다.');
  }
  const user = Object.assign({}, req.user.toJSON());
  delete user.password;
  return res.json(req.user);
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
router.get('/:id', (req, res) => {

});
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
router.get('/:id/posts', (req, res) => {

});

module.exports = router;
