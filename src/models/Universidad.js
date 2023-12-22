const { Model, DataTypes } = require("sequelize");

class Universidad extends Model{
 
  
  static initModel(sequelize) {
    Universidad.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
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
      modelName: 'Universidad',
      tableName: 'universidades',
      timestamps: true
    })
    
    return Universidad
  }
}

module.exports = Universidad;