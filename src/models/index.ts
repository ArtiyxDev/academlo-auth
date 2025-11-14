import User from "./User";
import EmailCode from "./EmailCode";

User.hasOne(EmailCode, {
  foreignKey: "user_id",
  as: "emailCode",
});
EmailCode.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

export { User, EmailCode };
