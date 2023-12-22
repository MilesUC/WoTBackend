const { Model, DataTypes } = require("sequelize");

class ConocioWot extends Model{
  
  static initModel(sequelize) {
    ConocioWot.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      conocio: {
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
      modelName: "ConocioWot",
      tableName: "conocio_wot",
      timestamps: true
    })
    
    return ConocioWot
  }
}

module.exports = ConocioWot;