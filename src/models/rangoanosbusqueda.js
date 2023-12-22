'use strict';
const { Model, DataTypes } = require("sequelize");

class RangoAnosBusqueda extends Model{
  
  static initModel(sequelize) {
    RangoAnosBusqueda.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      rango: {
        type: DataTypes.STRING
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    }, {
      sequelize,
      modelName: 'RangoAnosBusqueda',
      timestamps: true
    })
    
    return RangoAnosBusqueda
  }
}


module.exports = RangoAnosBusqueda;