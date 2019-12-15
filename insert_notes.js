const client = require("./client");
let newNote = {
  title: "is it working?",
  content: "hell yea"
};
client.insert(newNote, (error, notes) => {
  if (!error) {
    console.log("Note created successfully");
    console.log(notes);
  } else {
    console.error(error);
  }
});
