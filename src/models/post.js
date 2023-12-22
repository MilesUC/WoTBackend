const { Model, DataTypes } = require("sequelize");

class Post extends Model {
  static initModel(sequelize) {
    Post.init(
      {
        userId: DataTypes.STRING,
        communityId: DataTypes.INTEGER,
        content: DataTypes.STRING,
        edited: DataTypes.BOOLEAN,
        interactions: DataTypes.INTEGER,
        is_repost: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        modelName: "Post",
        tableName: "Posts",
      }
    );
    return Post;
  }
}

module.exports = Post;