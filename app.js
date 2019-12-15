const grpc = require("grpc");
const notesProto = grpc.load("notes.proto");
const uuidv1 = require("uuidv1");
const server = new grpc.Server();
const notes = [
  { id: "1", title: "Nothing Special", content: "content 1" },
  { id: "1", title: "Nothing Special", content: "content 2" }
];
server.addService(notesProto.NoteService.service, {
  list: (_, callback) => {
    callback(null, notes);
  },
  insert: (call, callback) => {
    let note = call.request;
    note.id = uuidv1();
    notes.push(note);
    callback(null, note);
  },
  delete: (call, callback) => {
    let existingNoteIndex = notes.findIndex(n => n.id == call.request.id);
    if (existingNoteIndex != -1) {
      notes.splice(existingNoteIndex, 1);
      callback(null, {});
    } else {
      callback({
        details: "Not found"
      });
    }
  }
});

// initializing the server
const PORT = process.env.PORT || "127.0.0.1:50051";
server.bind(PORT, grpc.ServerCredentials.createInsecure());
console.log(`Server is running at http:${PORT}`);
server.start();
