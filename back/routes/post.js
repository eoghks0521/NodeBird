const express = require('express');
const db = require('../models');
const multer = require('multer');
const path = require('path');
const { isLoggedIn, isExistPost } = require('./middleware');
const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb){ // cb는 done이라고 생각하면 된다.
      cb(null, 'uploads');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext); // 대환권.png, ext===.png, basename===대환권
      cb(null, basename + new Date().valueOf() + ext);
    }
  }),
  limits: { fileSize: 20* 1024 * 1024 },
});

//폼데이터 파일 -> req.files, 폼데이터 일반 텍스트 값 -> req.body => 멀터가 해줌
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
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
    //여기서 받는 image는 경로 값이기 때문에 req.body.image로 처리
    if (req.body.image) { // 이미지 주소를 여러개 올리면 image: [주소1, 주소2]
      if(Array.isArray(req.body.image)) {
        //Promise.all을 사용하여 배열로 db 처리하는 작업을 할 수 있다.
        const images = await Promise.all(req.body.image.map((image) => {
          return db.Image.create({ src: image});
        }));
        await newPost.addImages(images); //시퀄라이즈가 addImages, addImage 두가지 경우를 모두 제공해줌
      }else { // 이미지를 하나만 올리면 image : 주소1
        const image = await db.Image.create({ src: req.body.image });
        await newPost.addImage(image);
      }

    }
    // const User = await newPost.getUser();
    // newPost.User = User;
    // res.json(newPost);
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: db.User,
      }, {
        model: db.Image,
      }],
    });
    res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id', isLoggedIn, isExistPost, async (req, res, next) => {
  try{
    const post = req.post
    await db.Post.destroy({
      where: {id : post.id}}).then(() => {
        res.json(post.id);
    });
  }catch (e) {
    console.error(e);
    next(e);
  }
});


//image는 formData에서 키 값으로 설정한 값과 같아야한다. 하나의 이름으로 여러개를 올릴 때
//field는 formData에서 여러개 키 값을 사용하여 여러개 이미지를 업로드할 때
//none은 이미지를 하나도 안올리는 경우
router.post('/images', upload.array('image'), (req, res) => {
  //이미지 리사이징같은 부가적인 작업은 여기서 처리
  res.json(req.files.map(v=> v.filename));
});

router.get('/:id/comments', isExistPost, async (req, res, next) => {
  try {
    const post = req.post
    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id,
      },
      order: [['createdAt', 'ASC']],
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    res.json(comments);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/comment', isLoggedIn, isExistPost, async (req, res, next) => {
  try{
    const post = req.post
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    await post.addComment(newComment.id);
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    return res.json(comment);
  }catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post('/:id/like', isLoggedIn, isExistPost, async (req, res, next) => {
  try{
    const post = req.post
    await post.addLiker(req.user.id);
    res.json({ userId: req.user.id });
  }catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/like', isLoggedIn, isExistPost, async (req, res, next) => {
  try{
    const post = req.post
    await post.removeLiker(req.user.id);
    res.json({ userId: req.user.id });
  }catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/retweet', isLoggedIn, isExistPost, async (req, res, next)=> {
  try{
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [{
        model: db.Post,
        as: 'Retweet',
      }]
    });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    if( req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('자신의 글을 리트윗 할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await db.Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send('이미 리트윗했습니다.');
    }
    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    const retweetWithPrevPost = await db.Post.findOne({
      where: { id: retweet.id },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
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
    res.json(retweetWithPrevPost);
  } catch(e){

  }
})

module.exports = router;
