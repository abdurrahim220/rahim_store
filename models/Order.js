import mongoose from "mongoose";
import { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: { type: String },
    paymentIntentId: { type: String },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: {
      voucherCode: { type: String },
      discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      discountValue: { type: Number, min: 0 },
      maxDiscount: { type: Number, min: 0 },
    },
    total: { type: Number, required: true },
    shipping: { type: Object, required: true },
    delivery_status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    payment_status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate total
orderSchema.pre("save", function (next) {
  if (this.isModified("subtotal") || this.isModified("discount")) {
    this.calculateTotal();
  }
  next();
});

// Method to calculate total with discount
orderSchema.methods.calculateTotal = function () {
  let discountAmount = 0;

  if (this.discount && this.discount.discountValue) {
    if (this.discount.discountType === "percentage") {
      // Calculate percentage discount
      discountAmount = this.subtotal * (this.discount.discountValue / 100);

      // Apply max discount if specified
      if (this.discount.maxDiscount) {
        discountAmount = Math.min(discountAmount, this.discount.maxDiscount);
      }
    } else {
      // Fixed amount discount
      discountAmount = Math.min(this.discount.discountValue, this.subtotal);
    }
  }

  this.total = this.subtotal - discountAmount;
};

const Order = mongoose.model("Order", orderSchema);
export default Order;
