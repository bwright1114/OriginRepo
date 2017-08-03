
module.exports = function(sequelize, DataTypes) {
  var Cal_Events = sequelize.define("Cal_Events", {
    eventName: {
      type: DataTypes.STRING,
    },
    eventDate: {
      type: DataTypes.DATE,
    }
  });
  Cal_Events.associate = function(models) {
    Cal_Events.belongsTo(models.Teachers);
  };
  return Cal_Events;
};