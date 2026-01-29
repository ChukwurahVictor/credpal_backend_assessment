import mongoose from 'mongoose';
import Todo, { ITodo } from '../models/Todo';
import { ServiceError } from './auth.service';

export interface CreateTodoData {
  title: string;
  description: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
}

const checkOwnership = (todo: ITodo, userId: string): void => {
  if (todo.user.toString() !== userId) {
    const error: ServiceError = { status: 401, message: 'Not authorized' };
    throw error;
  }
};

const handleNotFound = (): never => {
  const error: ServiceError = { status: 404, message: 'Todo not found' };
  throw error;
};

export const getAllTodos = async (userId: string): Promise<ITodo[]> => {
  return Todo.find({ user: userId }).sort({ createdAt: -1 });
};

export const getTodoById = async (todoId: string, userId: string): Promise<ITodo> => {
  let todo: ITodo | null;
  
  try {
    todo = await Todo.findById(todoId);
  } catch (error: unknown) {
    if ((error as { kind?: string }).kind === 'ObjectId') {
      handleNotFound();
    }
    throw error;
  }

  if (!todo) {
    handleNotFound();
  }

  checkOwnership(todo!, userId);
  return todo!;
};

export const createTodo = async (
  data: CreateTodoData,
  userId: string
): Promise<ITodo> => {
  return Todo.create({
    title: data.title,
    description: data.description,
    user: userId,
  });
};

export const updateTodo = async (
  todoId: string,
  data: UpdateTodoData,
  userId: string
): Promise<ITodo> => {
  let todo: ITodo | null;

  try {
    todo = await Todo.findById(todoId);
  } catch (error: unknown) {
    if ((error as { kind?: string }).kind === 'ObjectId') {
      handleNotFound();
    }
    throw error;
  }

  if (!todo) {
    handleNotFound();
  }

  checkOwnership(todo!, userId);

  const updateData: UpdateTodoData = {};
  if (data.title) updateData.title = data.title;
  if (data.description) updateData.description = data.description;
  if (typeof data.completed === 'boolean') updateData.completed = data.completed;

  const updated = await Todo.findByIdAndUpdate(
    todoId,
    { $set: updateData },
    { new: true }
  );

  return updated!;
};

export const deleteTodo = async (todoId: string, userId: string): Promise<void> => {
  let todo: ITodo | null;

  try {
    todo = await Todo.findById(todoId);
  } catch (error: unknown) {
    if ((error as { kind?: string }).kind === 'ObjectId') {
      handleNotFound();
    }
    throw error;
  }

  if (!todo) {
    handleNotFound();
  }

  checkOwnership(todo!, userId);

  await Todo.findByIdAndDelete(todoId);
};
