require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :person"
  )
);
morgan.token("person", (request, response) => {
  return JSON.stringify(request.body);
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  if (!person.name || !person.number) {
    return response.status(400).json({ error: "name or number missing" });
  }
  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });
  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

// app.get("/info", (request, response) => {
//   response.send(
//     `<p>Phonebook has info over  ${persons.length}  people </p>
//     <p> ${new Date().toString()} </p>`
//   );
// });

// const generateId = () => {
//   const randomNumber =
//     persons.length > 0 ? Math.max(...persons.map((number) => number.id)) : 0;
//   return randomNumber + 1;
// };

// // const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
