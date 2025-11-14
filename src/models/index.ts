import User from "./User";
import EmailCode from "./EmailCode";

/**
 * Model Associations
 *
 * Defines relationships between database models.
 *
 * User <-> EmailCode Relationship:
 * - One-to-One: A user can have one email code at a time
 * - CASCADE: When a user is deleted, their email codes are also deleted
 * - Used for email verification and password reset functionality
 *
 * Benefits:
 * - Enables eager loading with include in queries
 * - Automatic foreign key constraint management
 * - Data integrity through CASCADE operations
 */

// User has one EmailCode (email verification or password reset)
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
