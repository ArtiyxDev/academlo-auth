import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

interface EmailCodeAttributes {
  id: number;
  code: string;
  user_id: number;
}

interface EmailCodeCreationAttributes
  extends Optional<EmailCodeAttributes, "id"> {}

class EmailCode
  extends Model<EmailCodeAttributes, EmailCodeCreationAttributes>
  implements EmailCodeAttributes
{
  public id!: number;
  public code!: string;
  public user_id!: number;

  public user?: User;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EmailCode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "emailCode",
    timestamps: true,
  }
);

export default EmailCode;
