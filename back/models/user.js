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
    //자바스크립트 객체에서 구분하는 이름이 as, 실제 DB에서 구분하는 이름이 foreignKey
    //foreignkey는 다대다 관계에서만 추가하면 된다.
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId'});
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId'});
  };

  return User;
}
