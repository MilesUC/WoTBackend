const { Model, DataTypes } = require("sequelize");

class Modalidad extends Model{
 
  static initModel(sequelize) {
    Modalidad.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tipoModalidad: {
        type: DataTypes.STRING
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at"
      }
    }, {
      sequelize,
      modelName: "Modalidad",
      tableName: "modalidades",
    })
    
    return Modalidad
  }
}

module.exports = Modalidad;