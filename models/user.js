const bcrypt = require('bcrypt');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8]
            }
        }
    },
    {
        hooks: {
            beforeCreate: async (newUser) => {
                newUser.password = await bcrypt.hash(newUser.password, 10);
                return newUser;
            },
            beforeUpdate: async (updatedUser) => {
                updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
                return updatedUser;
            }
        },
    
    
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);

module.exports = User;