// Event BD
module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define("Event", {
    // eslint-disable-next-line camelcase
    eventbrite_id: DataTypes.STRING
  });
  return Event;
};
