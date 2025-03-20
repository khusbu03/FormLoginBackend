const express = require("express");
const todoRouter = express.Router();
const {
  createTodo,
  updateTodo,
  deleteTodo,
  getAllTodos,
  getTodoById,
  reorderTodo
} = require("../controllers/todo.controlller");

const { userAuth } = require("../middleware/userAuth");

todoRouter.post("/", userAuth, createTodo);
todoRouter.get("/", userAuth, getAllTodos);

todoRouter.delete("/:todoId", userAuth, deleteTodo);
todoRouter.put("/:todoId", userAuth, updateTodo);
todoRouter.get("/:todoId", userAuth, getTodoById);

todoRouter.post("/reorder", userAuth, reorderTodo);

module.exports = todoRouter;
