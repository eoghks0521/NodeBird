const express = require('express');
const db = require('../models');
const router = express.Router();

router.get('/', async (req, res,next) => {
  try{
    const posts = await db.Post.findAll({
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
      order: [['createdAt', 'DESC']], //여러 컬럼을 조건으로 줄 수 있기 때문에 2차원 배열
    });
    res.json(posts);
  } catch(e){
    console.error(e);
    next(e);
  }
});

module.exports = router;
