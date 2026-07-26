import { Schema, model, Types } from "mongoose";

export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<CartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const CartSchema = new Schema<Cart>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = model<Cart>("Cart", CartSchema);