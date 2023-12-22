const { Model, DataTypes } = require("sequelize");

class AreaEspecifica extends Model {
  static initModel(sequelize) {
    AreaEspecifica.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        Area: {
          type: DataTypes.STRING,
        },
        createdAt: {
          type: DataTypes.DATE,
        },
        updatedAt: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
      }
    );

    return AreaEspecifica;
  }
}

module.exports = AreaEspecifica;
