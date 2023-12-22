const { Model, DataTypes, sequelize } = require("sequelize");

class PonderacionAtributo extends Model{
  static initModel(sequelize) {
    PonderacionAtributo.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      atributo: {
        type: DataTypes.STRING
      },
      ponderacion: {
        type: DataTypes.FLOAT
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    }, {
      sequelize,
      modelName: "PonderacionAtributo", // Set the model name explicitly
      tableName: "ponderacion_atributos", // Set the table name explicitly
      timestamps: true,
    })
    
    return PonderacionAtributo
  }
}

module.exports = PonderacionAtributo;

