module.exports = function(sequelize, DataTypes) {
  var Grades = sequelize.define('Grades', {
    grade: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });
  Grades.associate = function(models) {
    Grades.belongsTo(models.Assignments);
    Grades.belongsTo(models.Students);
  };
  return Grades;
};
