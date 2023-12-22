const { Model, DataTypes } = require("sequelize");

class FormularioPersonalidad extends Model{
  
  static initModel(sequelize) {
    FormularioPersonalidad.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      personalidad: {
        type: DataTypes.STRING
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
      modelName: 'FormularioPersonalidad',
      tableName: 'formulario_personalidades',
      timestamps: true
    })
    
    return FormularioPersonalidad
  }
}

module.exports = FormularioPersonalidad;