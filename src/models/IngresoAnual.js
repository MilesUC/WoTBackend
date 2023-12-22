const { Model, DataTypes, sequelize } = require("sequelize");

class IngresoAnual extends Model {
  static initModel(sequelize) {
    IngresoAnual.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        rango_ingresos_desde: {
          type: DataTypes.INTEGER,
        },
        rango_ingresos_hasta: {
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
        modelName: "IngresoAnual", // Set the model name explicitly
        tableName: "ingresos_anuales", // Set the table name explicitly
        timestamps: true,
        underscored: true,
      }
    );

    return IngresoAnual;
  }
}

module.exports = IngresoAnual;
