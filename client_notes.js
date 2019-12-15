const client = require("./client");
client.get({}, (error, notes) => {
  if (!error) {
    console.log("successfully fetch List notes");
    console.log(notes);
  } else {
    console.error(error);
  }
});
