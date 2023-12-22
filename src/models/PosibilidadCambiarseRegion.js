const { Model, DataTypes } = require("sequelize");

class PosibilidadCambiarseRegion extends Model{
  
  static initModel(sequelize) {
    PosibilidadCambiarseRegion.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      posibilidad: {
        type: DataTypes.STRING,
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
      modelName: 'PosibilidadCambiarseRegion',
      tableName: 'posibilidad_cambiarse_region',
      timestamps: true
    })
    
    return PosibilidadCambiarseRegion
  }
}

module.exports = PosibilidadCambiarseRegion;