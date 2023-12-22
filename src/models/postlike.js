const { Model, DataTypes } = require("sequelize");

class PostLike extends Model {
    static initModel(sequelize) {
      PostLike.init(
        {
          usuariaId: DataTypes.STRING,
          postId: DataTypes.INTEGER,
        },
        {
          sequelize,
          modelName: "PostLike",
          tableName: "PostLikes",
        }
      );
      return PostLike;
    }
  }
  
module.exports = PostLike;