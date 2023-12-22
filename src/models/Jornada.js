const { Model, DataTypes } = require("sequelize");

class Jornada extends Model{
  
  static initModel(sequelize) {
    Jornada.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tipoJornada: {
        type: DataTypes.STRING,
        field: "tipo_jornada"
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
      modelName: "Jornada",
      tableName: "jornadas",
      timestamps: true,
    })
    
    return Jornada
  }
}

module.exports = Jornada;