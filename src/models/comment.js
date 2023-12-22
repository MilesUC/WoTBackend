const { Model, DataTypes } = require("sequelize");

class Comment extends Model {
  static initModel(sequelize) {
    Comment.init(
      {
        userId: DataTypes.STRING,
        postId: DataTypes.INTEGER,
        content: DataTypes.STRING
      },
      {
        sequelize,
        modelName: "Comment",
        tableName: "Comments",
      }
    );
    return Comment;
  }
}

module.exports = Comment;