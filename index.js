const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

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

let persons = [
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info over  ${persons.length}  people </p>
    <p> ${new Date().toString()} </p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

// const generateId = () => {
//   const randomNumber =
//     persons.length > 0 ? Math.max(...persons.map((number) => number.id)) : 0;
//   return randomNumber + 1;
// };

app.post("/api/persons", (request, response) => {
  const ids = persons.map((person) => person.id);
  const maxId = Math.max(...ids);
  const person = request.body;
  if (person.name === undefined || person.number === undefined) {
    return response.status(400).json({ error: "name or number missing" });
  }
  const newPerson = {
    name: person.name,
    number: person.number,
    id: maxId + 1,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
