module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('federateduser', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
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
                type: DataTypes.STRING
            },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('federateduser');
    }
};
