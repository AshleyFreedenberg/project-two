module.exports = (sequelize, DataTypes) => {
  const Example = sequelize.define("Example", {
    url: DataTypes.STRING
  });

  Example.associate = function(models) {
    models.Example.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Example;
};
