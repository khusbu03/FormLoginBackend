const Todo = require("../models/Todo");
const User = require("../models/User");
const mongoose = require("mongoose");

const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const createTodoService = async (req) => {
  try {
    const { title, description } = req.body;
    const { _id } = req.body.user;

    if (!title || !description)
      return new ApiError(400, "All fields are required");

    const existingUser = await User.findOne({ _id });
    if (!existingUser) return new ApiError(401, "User does not exist");

    const totalTodosOfUser = existingUser.todos.length;

    // create new todo
    const newTodo = new Todo({
      title,
      description,
      userId: _id,
      sequenceNumber: totalTodosOfUser === 0 ? 0 : totalTodosOfUser + 1
    });

    await newTodo.save();

    // update the correponding user and update the user and add the todo id in the users todos
    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { $push: { todos: newTodo._id } }
    );

    return new ApiResponse(200, "Todo created!", newTodo);
  } catch (error) {
    console.log("error", error.message);
    return new ApiError(400, error.message);
  }
};

const getAllTodosService = async (req) => {
  try {
    const { _id: userId } = req.body.user;
    const { status, filter, priority, page = 1, limit = 10 } = req.query;
    let queryObject = {
      userId,
      isDeleted: null
    };

    if (status) queryObject.status = status;
    if (filter) queryObject.filter = filter;
    if (priority) queryObject.priority = priority;

    console.log("query obj", queryObject);

    const allTodo = await Todo.find(queryObject)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (!allTodo.length) return new ApiError(404, "No todos!");

    return new ApiResponse(
      200,
      `Successfully fetched all todos of user: ${_id}`,
      allTodo
    );
  } catch (error) {
    return new ApiError(500, error.message);
  }
};

const deleteTodoService = async (req) => {
  try {
    const { todoId } = req.params;
    const { _id: userId } = req.body.user;

    const deletedTodo = await Todo.findByIdAndUpdate(
      { _id: todoId, userId },
      { isDeleted: Date.now() }
    );
    console.log("deleted todo", deletedTodo);

    return new ApiResponse(200, `Successfully deleted todo ! `, deletedTodo);
  } catch (error) {
    return new ApiError(500, error.message);
  }
};

const getTodoByIdService = async (req) => {
  try {
    const { _id: userId } = req.body.user;
    const { todoId } = req.params;

    const todo = await Todo.find({ _id: todoId });
    if (!todo) return new ApiError(404, "No todo!");

    return new ApiResponse(200, "Todo fetched ", todo);
  } catch (error) {
    return new ApiError(500, error.message);
  }
};

const updateTodoService = async (req) => {
  try {
    const { title, description, filter, deadline, priority, status } = req.body;

    const { todoId } = req.params;
    const { _id: userId } = req.body.user;
    console.log("todoId", todoId);
    console.log("userId", userId);

    const updatedTodo = await Todo.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(todoId),
        userId: new mongoose.Types.ObjectId(userId)
      },
      { title, description, filter, deadline, priority, status },
      { new: true }
    );
    console.log("updatedTodo:-", updatedTodo);
    if (!updatedTodo) return new ApiError(400, "No todo to update");

    return new ApiResponse(200, `Successfully updated todo ! `, updatedTodo);
  } catch (error) {
    return new ApiError(500, error.message);
  }
};

const reorderTodoService = async (req) => {
  try {
    const { oldIndex, newIndex } = req.body;
    const { _id: userId } = req.body.user;

    if (oldIndex === newIndex) {
      return new ApiResponse(200, "No changes needed", []);
    }

    const smallIndex = Math.min(oldIndex, newIndex);
    const greaterIndex = Math.max(oldIndex, newIndex);
    const direction = oldIndex < newIndex ? -1 : 1; // Shift direction

    // Find todos that need to be updated
    const todosToUpdate = await Todo.find({
      userId,
      sequenceNumber: { $gte: smallIndex, $lte: greaterIndex }
    }).sort({ sequenceNumber: 1 });

    if (!todosToUpdate.length) {
      return new ApiError(404, "No todos found in the given range");
    }

    // Adjust sequence numbers
    todosToUpdate.forEach((todo) => {
      if (todo.sequenceNumber === oldIndex) {
        todo.sequenceNumber = newIndex; // Move the dragged todo
      } else if (todo.sequenceNumber) {
        todo.sequenceNumber += direction; // Shift other todos
      }
    });

    // Bulk update
    const bulkUpdates = todosToUpdate.map((todo) => ({
      updateOne: {
        filter: { _id: todo._id },
        update: { sequenceNumber: todo.sequenceNumber }
      }
    }));

    await Todo.bulkWrite(bulkUpdates);

    const updatedTodos = await Todo.find({
      userId,
      sequenceNumber: { $gte: smallIndex, $lte: greaterIndex }
    }).sort({ sequenceNumber: 1 });

    return new ApiResponse(200, "Successfully reordered!", updatedTodos);
  } catch (error) {
    console.error("Error in reorderTodoService:", error);
    return new ApiError(500, "Failed to reorder todos");
  }
};

module.exports = {
  createTodoService,
  getAllTodosService,
  deleteTodoService,
  updateTodoService,
  getTodoByIdService,
  reorderTodoService
};
