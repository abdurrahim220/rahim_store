import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s]{2,50}$/.test(v);
        },
        message: "Name must be 2-50 alphabetic characters",
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: 'Gender must be either "male", "female", or "other"',
      },
    },
    image: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
      set: validator.normalizeEmail,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "seller"],
        message: 'Role must be either "user" or "admin"',
      },
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [12, "Password cannot exceed 12 characters"],
      select: false,
      validate: {
        validator: function (v) {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/.test(v);
        },
        message:
          "Password must contain at least one uppercase, one lowercase, and one number",
      },
    },
    cloudinary_id: {
      type: String,
      required: true,
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance method for password comparison
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Virtual for full name (example of virtual fields)
userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

// Static method for email existence check
userSchema.statics.emailExists = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

const User = mongoose.model("User", userSchema);

export default User;
