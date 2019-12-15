const grpc = require("grpc");
const loader = require("@grpc/proto-loader");
const PATH = "127.0.0.1:50050";

const packageDefinition = loader.loadSync("./notes.proto");
const package = grpc.loadPackageDefinition(packageDefinition);
const Client = package.NoteService;
const client = new Client(PATH, grpc.credentials.createInsecure());

module.exports = client;
