module.exports = function(sequelize, DataTypes) {
  var Attendance = sequelize.define('Attendance', {
    presence: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['Present', 'Tardy', 'Absent'],
      defaultValue: 'Present'
    }
  });
  Attendance.associate = function(models) {
    Attendance.belongsTo(models.Dates);
    Attendance.belongsTo(models.Students);
  };
  return Attendance;
};