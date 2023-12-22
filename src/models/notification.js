const { Model, DataTypes } = require("sequelize");

class Notification extends Model {
  static initModel(sequelize) {
    Notification.init(
      {
        userId: DataTypes.STRING,
        content: DataTypes.STRING,
        triggerUserId: DataTypes.STRING,
        postId: DataTypes.INTEGER,
        section: DataTypes.STRING,
        type: DataTypes.STRING,
        seen: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        modelName: "Notification",
        tableName: "Notifications",
      }
    );
    return Notification;
  }
}

module.exports = Notification;