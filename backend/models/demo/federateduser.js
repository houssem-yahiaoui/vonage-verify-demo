const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FederatedUser extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            // define association here
        }
    }
    FederatedUser.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING
            },
            google_id: {
                type: DataTypes.STRING
            },
            picture: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.STRING
            },
            phone_number: {
                type: DataTypes.JSONB
            }
        },
        {
            sequelize,
            underscored: true,
            tableName: 'federateduser',
            modelName: 'FederatedUser'
        }
    );
    return FederatedUser;
};
