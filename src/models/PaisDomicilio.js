const { Model, DataTypes } = require("sequelize");

class PaisDomicilio extends Model{
  
  
  static initModel(sequelize) {
    PaisDomicilio.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      // FK
      pais: {
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
      modelName: 'PaisDomicilio',
      tableName: 'pais_domicilios',
      timestamps: true
    })
    
    return PaisDomicilio
  }
}

module.exports = PaisDomicilio;