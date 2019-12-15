const express = require("express");
const connectDB = require("./config/db.js");
const routes = require("./routes/todo");
const grpc = require("grpc");

const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("notes.proto");
const grpcLibrary = require("@grpc/grpc-js");
const notesProto = grpcLibrary.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
const app = express();
const cors = require("cors");

const Todo = require("./models/Todo");

// Connecting DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Entry route
app.use("/api/v1/todo", routes);

// 404 not found
app.use((req, res) =>
  res.status(404).send({
    message: `API route not found`,
    route: `${req.hostname}${req.url}`
  })
);

server.addService(notesProto.NoteService.service, {
  GetAll: async (_, callback) => {
    const notes = await Todo.find({});
    console.log(notes);
    callback(null, { notes: notes });
  },
  Get: async (call, callback) => {
    console.log("server", call);
    let note = await Todo.find({});
    if (note) {
      callback(null, note);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      });
    }
  },
  Add: async (call, callback) => {
    console.log("from server", call.request);
    let data = call.request;
    let newTodo = await new Todo(data);
    newTodo.save();
    if (newTodo) {
      callback(null, newTodo);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Something went wrong"
      });
    }
  },
  Delete: async (call, callback) => {
    console.log(call.request);
    const todoToDelete = await Todo.findByIdAndDelete(call.request._id);
    if (todoToDelete) {
      callback(null, todoToDelete);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Todo not found"
      });
    }
  },
  Update: async (call, callback) => {
    console.log(call.request);
    const updatedTodo = await Todo.findByIdAndUpdate(
      call.request._id,
      call.request,
      {
        new: true,
        runValidators: true
      }
    );
    console.log(updatedTodo);
    if (updatedTodo) {
      callback(null, updatedTodo);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Todo not found"
      });
    }
    // let note = call.request;
    // note.id = uuidv1();
    // notes.push(note);
    // callback(null, note);
  }
});

// initializing the server
const PORT = 8000;
const MAIN_PORT = process.env.PORT || "127.0.0.1:50050";
app.listen(PORT, () => console.log(`Server is running on Port ${MAIN_PORT}`));
server.bind(MAIN_PORT, grpc.ServerCredentials.createInsecure());
console.log(`Server is running at http:${PORT}`);
server.start();
