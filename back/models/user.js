module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // 테이블명: users(소문자, 복수형으로 바뀜)
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  });

  User.associate = (db) => {
    db.User.hasMany(db.Post, {as: 'Posts'});
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked'});
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers'});
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings'});
  };

  return User;
}
