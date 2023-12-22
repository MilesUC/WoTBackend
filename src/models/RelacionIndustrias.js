const { Model, DataTypes } = require("sequelize");

class RelacionIndustrias extends Model {
  static initModel(sequelize) {
    RelacionIndustrias.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        id_industria_a: {
          type: DataTypes.STRING,
        },
        id_industria_b: {
          type: DataTypes.STRING,
        },
        ponderacion: {
          type: DataTypes.FLOAT,
        },
      },
      {
        sequelize,
        modelName: "RelacionIndustrias",
        tableName: "relacion_industrias",
        timestamps: false,
      }
    );

    return RelacionIndustrias;
  }
}

module.exports = RelacionIndustrias;
