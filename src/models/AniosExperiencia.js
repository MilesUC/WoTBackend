const { Model, DataTypes } = require("sequelize");

class AniosExperiencia extends Model{
  
  static initModel(sequelize) {
    AniosExperiencia.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      rango_experiencia_desde: {
        type: DataTypes.INTEGER
      },
      rango_experiencia_hasta: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    }, {
      sequelize,
      modelName: 'AniosExperiencia',
      tableName: 'anios_experiencias',
      timestamps: true
    })
    
    return AniosExperiencia
  }
}

module.exports = AniosExperiencia;