const { Model, DataTypes, sequelize } = require("sequelize");

class CantidadEmpleados extends Model {
  static initModel(sequelize) {
    CantidadEmpleados.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        rango_empleados_desde: {
          type: DataTypes.INTEGER,
        },
        rango_empleados_hasta: {
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
        modelName: "CantidadEmpleados", // Set the model name explicitly
        tableName: "cantidad_empleados", // Set the table name explicitly
        timestamps: true,
        underscored: true,
      }
    );

    return CantidadEmpleados;
  }
}

module.exports = CantidadEmpleados;
