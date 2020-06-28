const passport = require('passport');
const local = require('./local');
const db = require('../models');
module.exports = () => {
  //req.login을 하면 serializeUser 실행
  passport.serializeUser((user, done) => { // 서버쪽에 [{ id: 3, cookie: 'asdfe' }] 형태로 쿠키 정보 관리-> 프론트에서 서버로 쿠키를 보내면 그 쿠키가 무슨 id에 연결되어 있는지 알 수 있다.
    return done(null, user.id);
  });

  //서버는 메모리에서 id 정보밖에 찾을 수 없으므로 디비에서 나머지 정보들을 불러온다.
  // 클라이언트에서 요청을 보내올 때마다 실행된다.
  // 그래서 실무에서는 deserializeUser 결과물을 캐싱한다.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: {id},
      });
      return done(null, user); // req.user에 저장됨
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });

  local();
}
