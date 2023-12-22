const { Model, DataTypes } = require("sequelize");

class RelacionProfesion extends Model {
  static initModel(sequelize) {
    RelacionProfesion.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        id_profesion_a: {
          type: DataTypes.STRING,
        },
        id_profesion_b: {
          type: DataTypes.STRING,
        },
        ponderacion: {
          type: DataTypes.FLOAT,
        },
      },
      {
        sequelize,
        modelName: "RelacionProfesion",
        tableName: "relacion_profesion",
        timestamps: false,
      }
    );

    return RelacionProfesion;
  }
}

module.exports = RelacionProfesion;
