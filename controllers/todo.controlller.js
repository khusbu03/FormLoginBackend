const {
  createTodoService,
  getAllTodosService,
  deleteTodoService,
  getTodoByIdService,
  updateTodoService,
  reorderTodoService,
  searchTodoService
} = require("../service/todo.Service");

const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

async function createTodo(req, res) {
  try {
    const createTodoServiceResponse = await createTodoService(req);

    if (!createTodoServiceResponse.success) throw createTodoServiceResponse;

    return res.status(createTodoServiceResponse.statusCode).json({
      success: true,
      message: createTodoServiceResponse.message,
      data: createTodoServiceResponse.data
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }
}

async function getAllTodos(req, res) {
  try {
    const { search } = req.query;
    let serviceResponse;
    if (search) serviceResponse = await searchTodoService(req);
    else serviceResponse = await getAllTodosService(req);

    if (!serviceResponse.success) throw serviceResponse;

    return res.status(serviceResponse.statusCode).json({
      success: true,
      message: serviceResponse.message,
      data: serviceResponse.data
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }
}

async function deleteTodo(req, res) {
  try {
    const deleteTodoServiceResponse = await deleteTodoService(req);

    if (!deleteTodoServiceResponse.success) throw deleteTodoServiceResponse;

    return res.status(deleteTodoServiceResponse.statusCode).json({
      success: true,
      message: deleteTodoServiceResponse.message,
      data: deleteTodoServiceResponse.data
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }
}

async function getTodoById(req, res) {
  try {
    const getTodoServiceResponse = await getTodoByIdService(req);
    if (!getTodoServiceResponse.success) throw getTodoServiceResponse;

    return res.status(getTodoServiceResponse.statusCode).json({
      success: true,
      message: getTodoServiceResponse.message,
      data: getTodoServiceResponse.data
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }
}

async function updateTodo(req, res) {
  try {
    const updateTodoServiceResponse = await updateTodoService(req);

    if (!updateTodoServiceResponse.success) throw updateTodoServiceResponse;

    return res.status(200).json({
      success: true,
      message: updateTodoServiceResponse.message,
      data: updateTodoServiceResponse.data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function reorderTodo(req, res) {
  try {
    const reorderTodoServiceResponse = await reorderTodoService(req);

    if (!reorderTodoServiceResponse.success) throw reorderTodoServiceResponse;

    return res.status(200).json({
      success: true,
      message: reorderTodoServiceResponse.message,
      data: reorderTodoServiceResponse.data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  createTodo,
  getAllTodos,
  deleteTodo,
  updateTodo,
  getTodoById,
  reorderTodo
};
