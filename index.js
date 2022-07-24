const express = require("express");
// const redis = require("redis");
const Redis = require("ioredis");
const db = require("./sequalize");
const studentModel = require("./studentModel");

const App = express();
App.use(express.json());
const redis = new Redis();

// const redisClient = redis.createClient({ socket: { port: 6379 } });
// redisClient.connect();
// redisClient.on("connect", () => {
//   console.log("redis is connected");
// });

// Post route

App.post("/new-record", async (req, res) => {
  try {
    const { sName, sAge, sEmail } = req.body;
    const response = await studentModel.create({
      Name: sName,
      Age: sAge,
      Email: sEmail,
    });
    // console.log(response);
    res.send("New record added successfully");
  } catch (error) {
    console.error(`Error : ${error}`);
  }
});

//Get route

const cacheAll = (req, res, next) => {};

App.get("/all-record", async (req, res, next) => {
  try {
    const student_data = await studentModel.findAll();
    res.json(student_data);
    // console.log(student_data[1].dataValues);
  } catch (error) {
    res.status(400).json(`Error : ${err}`);
  }
});

// get by uniqueID route

const cacheOne = (req, res, next) => {
  const { id } = req.params;
  redis.get(id, (error, result) => {
    if (error) throw error;
    if (result !== null) {
      console.log(`Data found in cache`);
      return res.json(JSON.parse(result));
    } else {
      return next();
    }
  });
};

App.get("/recordId/:id", cacheOne, async (req, res) => {
  const UID = req.params.id;
  const student_data = await studentModel.findOne({
    where: {
      UniqueID: UID,
    },
  });
  redis.setex(UID, 10, JSON.stringify(student_data), () => {
    console.log(`Data saved in cache`);
  });
  return res.json(student_data);
});

// delete by uniqueId

App.delete("/record/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await studentModel.destroy({
      where: {
        UniqueID: id,
      },
    });
    res.send("record deleted");
  } catch (error) {
    res.send(`Error : ${err}`);
  }
});

// update name by id

App.patch("/UpdateRecord/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { sName } = req.body;
    const response = await studentModel.update(
      {
        Name: sName,
      },
      { where: { UniqueID: id } }
    );
    console.log(response);
    res.send(`User name with ${id} updated`);
  } catch (error) {
    res.send(`Error :${error}`);
    console.log(error);
  }
});

const initApp = async () => {
  try {
    await db.authenticate();
    console.log(`Connection established successfully`);

    studentModel.sync({
      alter: true,
    });

    console.log(redis.status);

    App.listen(3000, () => {
      console.log(`Server started on port 3000`);
    });
  } catch (error) {
    console.error(`Cannot establish the connection, ${error.original}`);
  }
};

initApp();
