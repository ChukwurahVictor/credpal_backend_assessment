import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITodo extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Todo: Model<ITodo> = mongoose.model<ITodo>('Todo', todoSchema);

export default Todo;
