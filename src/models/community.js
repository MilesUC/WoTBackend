const { Model, DataTypes } = require("sequelize");

class Community extends Model {
  static initModel(sequelize) {
    Community.init(
      {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Community",
        tableName: "Communities",
      }
    );
    return Community;
  }
}

module.exports = Community;