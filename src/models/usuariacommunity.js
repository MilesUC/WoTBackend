const { DataTypes, Model } = require("sequelize");

class UsuariaCommunity extends Model {
  static initModel(sequelize) {
    UsuariaCommunity.init(
      {
        communityId: DataTypes.INTEGER,
        userId: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "UsuariaCommunity",
      }
    );
    return UsuariaCommunity;
  }
}

module.exports = UsuariaCommunity;