const mongoose = require("mongoose");

const URL = process.env.MONGODB_URI;

mongoose
  .connect(URL)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error conecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 3,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{1,}$/.test(v);
      },
      message: "not a valid phone number!",
    },
    required: true,
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
  },
});
const Person = mongoose.model("Person", personSchema);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
