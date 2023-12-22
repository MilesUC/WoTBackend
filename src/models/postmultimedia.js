const { Model, DataTypes } = require("sequelize");

class PostMultimedia extends Model {
  static initModel(sequelize) {
    PostMultimedia.init(
      {
        postId: DataTypes.INTEGER,
        link: DataTypes.STRING
      },
      {
        sequelize,
        modelName: "PostMultimedia",
        tableName: "PostMultimedias",
      }
    );
    return PostMultimedia;
  }
}

module.exports = PostMultimedia;