const express = require('express');
const db = require('../models');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try{
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if(hashtags) {
      const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      })));// 모든 tag들을 저장하기 위한 작업을 위해 Promise.all 사용
      console.log(result);
      await newPost.addHashtags(result.map(r=>r[0]));// add*이름* sequelize가 자동으로 만들어 주는 함수 - as가 있으면 그 이름을 참조하고 없으면 모델이름을 보고 만듬
    }
    // const User = await newPost.getUser();
    // newPost.User = User;
    // res.json(newPost);
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: db.User,
      }],
    });
    res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/images', (req, res) => {

});

module.exports = router;
