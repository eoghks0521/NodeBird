const express = require('express');
const db = require('../models');
const router = express.Router();

router.get('/', async (req, res,next) => {
  try{
    let where = {};
    if (parseInt(req.query.lastId, 10)){
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), //lt 속성은 less than, 전체적 의미는 lastId보다 작은 id를 가져온다.
        },
      };
    }
    const posts = await db.Post.findAll({
      where,
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.Image,
      }, {
        model: db.User,
        through: 'Like',
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: db.Post,
        as: 'Retweet',
        include: [{
          model: db.User,
          attributes: ['id', 'nickname'],
        }, {
          model: db.Image,
        }],
      }],
      order: [['createdAt', 'DESC']], //여러 컬럼을 조건으로 줄 수 있기 때문에 2차원 배열
      limit: parseInt(req.query.limit, 10),
    });
    res.json(posts);
  } catch(e){
    console.error(e);
    next(e);
  }
});

module.exports = router;
