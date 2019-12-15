const express = require("express");
const client = require("../client");
const router = express.Router();
const mongoose = require("mongoose");
const Todo = require("../models/Todo");

// @route    GET api/v1/todo/todos
// @desc     Get all todos
// @access   Private
router.get("/todos", async (req, res) => {
  try {
    client.GetAll({}, (error, notes) => {
      if (!error) {
        console.log("successfully fetch List notes");
        console.log(notes);
        return res.status(200).json({
          success: true,
          notes
        });
      } else {
        console.log(error);
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

// @route    GET api/v1/todo/todo/id
// @desc     Get specific todos
// @access   Private
router.get("/todo/:id", async (req, res) => {
  try {
    console.log("from route", req.params.id);
    const id = req.params.id;
    client.Get({ id: id }, (error, notes) => {
      if (!error) {
        console.log("successfully fetch List notes");
        console.log(notes);
        return res.status(200).json({
          success: true,
          notes
        });
      } else {
        return res.status(400).json({
          status: false,
          message: error.message
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

// @route    POST api/v1/todo/add
// @desc     Add Todo
// @access   Private
router.post("/add", async (req, res) => {
  console.log("body:", req.body);
  let { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields"
    });
  }
  try {
    client.Add({ title, description }, (error, notes) => {
      if (!error) {
        console.log("Todo added successfully!");
        return res.status(200).json({
          success: true,
          notes
        });
      } else {
        return res.status(400).json({
          status: false,
          message: error.message
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

// // @route    DELETE api/v1/todo/delete/:id
// // @desc     Delete Todo
// // @access   Private
router.delete("/delete/:id", async (req, res) => {
  const _id = req.params.id;
  const isValidObjectId = mongoose.Types.ObjectId.isValid(_id);
  if (!isValidObjectId) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid Object ID" });
  }
  try {
    console.log(req.params.id);
    client.Delete({ _id }, (error, notes) => {
      if (!error) {
        console.log("Todo successfully deleted!");
        console.log(notes);
        return res.status(200).json({
          success: true,
          notes
        });
      } else {
        return res.status(400).json({
          status: false,
          message: error.message
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

// @route    UPDATE api/v1/todo/update/:id
// @desc     Update Todo
// @access   Private
router.put("/update/:id", async (req, res) => {
  const _id = req.params.id;
  const { title, description, isCompleted } = req.body;
  // validate objectID
  const isValidObjectId = mongoose.Types.ObjectId.isValid(_id);
  if (!isValidObjectId) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid Object ID" });
  }

  // check empty body
  if (Object.keys(req.body).length < 1) {
    return res
      .status(400)
      .json({ status: false, message: "Fields required in body" });
  }

  if (!title || !description || !isCompleted) {
    return res.status(400).json({ status: false, message: "Fill all fields" });
  }

  try {
    client.Update({ _id, title, description, isCompleted }, (error, notes) => {
      if (!error) {
        console.log("Todo successfully updated!");
        console.log(notes);
        return res.status(200).json({
          success: true,
          notes
        });
      } else {
        return res.status(400).json({
          status: false,
          message: error.message
        });
      }
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({
      message: "Internal server error",
      status: false,
      error: error.message40520
    });
  }
});

module.exports = router;
