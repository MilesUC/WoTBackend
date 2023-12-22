const { Model, DataTypes } = require("sequelize");

class RelacionAreas extends Model {
  static initModel(sequelize) {
    RelacionAreas.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        id_area_a: {
          type: DataTypes.STRING,
        },
        id_area_b: {
          type: DataTypes.STRING,
        },
        ponderacion: {
          type: DataTypes.FLOAT,
        },
      },
      {
        sequelize,
        modelName: "RelacionAreas",
        tableName: "relacion_areas",
        timestamps: false,
      }
    );

    return RelacionAreas;
  }
}

module.exports = RelacionAreas;
