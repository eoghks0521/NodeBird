const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
  try{
    const posts = await db.Post.findAll({
      include: [{
        model: db.Hashtag,
        // 한글 같은 경우에는 주소창에 그대로 쳐지지 않는다. -> uri 컴포넌트로 바뀜 따라서 decode 해주어야함
        where: { name: decodeURIComponent(req.params.tag) },
      }, {
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
    });
    res.json(posts);
  }catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
