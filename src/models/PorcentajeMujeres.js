const { Model, DataTypes } = require("sequelize");

class PorcentajeMujeres extends Model {
  static initModel(sequelize) {
    PorcentajeMujeres.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // Revisar
        porcentaje_mujeres_desde: {
          type: DataTypes.INTEGER,
        },
        porcentaje_mujeres_hasta: {
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
        modelName: "PorcentajeMujeres", // Set the model name explicitly
        tableName: "porcentaje_mujeres", // Set the table name explicitly
        timestamps: true,
        underscored: true,
      }
    );

    return PorcentajeMujeres;
  }
}

module.exports = PorcentajeMujeres;
