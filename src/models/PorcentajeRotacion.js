const { Model, DataTypes } = require("sequelize");

class PorcentajeRotacion extends Model {
  static initModel(sequelize) {
    PorcentajeRotacion.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        porcentaje_rotacion_desde: {
          type: DataTypes.INTEGER,
        },
        porcentaje_rotacion_hasta: {
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
        modelName: "PorcentajeRotacion", // Set the model name explicitly
        tableName: "porcentaje_rotacion", // Set the table name explicitly
        timestamps: true,
        underscored: true,
      }
    );

    return PorcentajeRotacion;
  }
}

module.exports = PorcentajeRotacion;
