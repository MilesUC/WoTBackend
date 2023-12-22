const { Model, DataTypes } = require("sequelize");

class Fundacion extends Model {
  static initModel(sequelize) {
    Fundacion.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        rango_anios_desde: {
          type: DataTypes.INTEGER,
        },
        rango_anios_hasta: {
          type: DataTypes.INTEGER,
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
        modelName: "Fundacion", // Set the model name explicitly
        tableName: "fundaciones", // Set the table name explicitly
        timestamps: true,
        underscored: true,
      }
    );

    return Fundacion;
  }
}

module.exports = Fundacion;
