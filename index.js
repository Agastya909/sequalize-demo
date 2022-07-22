const express = require("express");
const db = require("./sequalize");
const studentModel = require("./studentModel");
const App = express();
App.use(express.json());

// Post route

App.post("/new-record", (req, res) => {
  const { sName, sAge, sEmail } = req.body;
  studentModel
    .create({
      Name: sName,
      Age: sAge,
      Email: sEmail,
    })
    .then(() => {
      res.send(`Record created successfully`);
    })
    .catch((error) => {
      res.send(`Error : ${error}`);
    });
});

//Get route

App.get("/all-record", (req, res) => {
  studentModel
    .findAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(`Error : ${err}`);
    });
});

// get by uniqueID route

App.get("/recordId/:id", (req, res) => {
  const UID = req.params.id;
  studentModel
    .findOne({
      where: {
        UniqueID: UID,
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(`Error : ${err}`);
    });
});

// get by Name route

App.get("/recordName/:name", (req, res) => {
  var name = req.params.name;
  const sendName = name.replace("+", " ");
  studentModel
    .findOne({
      where: {
        Name: sendName,
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(`Error : ${err}`);
    });
});

// delete by uniqueId

App.delete("/record/:id", (req, res) => {
  const id = req.params.id;
  studentModel
    .destroy({
      where: {
        UniqueID: id,
      },
    })
    .then(() => {
      res.send(`record deleted successfully`);
    })
    .catch((err) => {
      res.send(`Error : ${err}`);
    });
});

// update name by id

App.patch("/UpdateRecord/:id", (req, res) => {
  const { id, sName } = req.body;
  studentModel
    .update(
      {
        Name: sName,
      },
      { where: { UniqueID: id } }
    )
    .then(() => {
      res.send(`User name with ${id} updated`);
    })
    .catch((err) => {
      res.send(`Error :${err}`);
    });
});

const initApp = async () => {
  console.log(`Testing the connection.`);

  try {
    await db.authenticate();
    console.log(`Connection established successfully`);

    studentModel.sync({
      alter: true,
    });

    App.listen(3000, () => {
      console.log(`Server started on port 3000`);
    });
  } catch (error) {
    console.error(`Cannot establish the connection, ${error.original}`);
  }
};

initApp();
