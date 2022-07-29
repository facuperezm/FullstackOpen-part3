require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :person"
  )
);
morgan.token("person", (request, response) => {
  return JSON.stringify(request.body);
});

// app.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((person) => {
      if (Person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const { name, number } = { ...body };
  const person = { name, number };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
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

  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: "unknown endpoint",
  });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({
      error: "malformatted id",
    });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({
      error: error.message,
    });
  }
  next(error);
};
app.use(errorHandler);

// app.delete("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   persons = persons.filter((person) => person.id !== id);
//   response.status(204).end();
// });

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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
