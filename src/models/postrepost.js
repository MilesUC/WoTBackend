const { Model, DataTypes } = require('sequelize');

class PostRepost extends Model {
    static initModel(sequelize) {
      PostRepost.init(
        {
          newPostId: DataTypes.INTEGER, // Id del post que se crea al repostear
          originalPostId: DataTypes.INTEGER, // Id del post existente que se reposteo
        },
        {
          sequelize,
          modelName: "PostRepost",
          tableName: "PostReposts",
        }
      );
      return PostRepost;
    }
  }
  
module.exports = PostRepost;