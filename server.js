const express = require("express");
const mysql = require("mysql");

const app = express();

app.use(express.json());

//mysql connect
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mysql_nodejs",
  port: "8889",
});

connection.connect((err) => {
  if (err) {
    console.log("error connecting to Mysql database = ", err);
    return;
  }
  console.log("Myqsl successfully connected");
});

//create Routes
app.post("/create", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    connection.query(
      "INSERT INTO users(email ,username, password) VALUES (?,?,?)",
      [email, username, password],
      (err, reuslt, fields) => {
        if (err) {
          console.log("Error while inserting a user into the database ", err);
          return res.status(400).send();
        }
        return res.status(201).json({ message: "New user successfully" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

//read
app.get("/read", async (req, res) => {
  try {
    connection.query("SELECT * FROM users", (err, result, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      return res.status(200).json(result);
    });
  } catch (error) {
    console.log(err);
    res.status(500).send();
  }
});

//Read Single user from db
app.get("/read/single/:email", async (req, res) => {
  const email = req.params.email;
  try {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        return res.status(200).json(result);
      }
    );
  } catch (error) {
    console.log(err);
    res.status(500).send();
  }
});

//update
app.patch("/update/:email", async (req, res) => {
  const email = req.params.email;
  const newPassword = req.body.newPassword;
  try {
    connection.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [newPassword, email],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        return res
          .status(200)
          .json({ message: "User password update successfully" });
      }
    );
  } catch (error) {
    console.log(err);
    res.status(500).send();
  }
});

//delete
app.delete("/delete/:email", async (req, res) => {
  const email = req.params.email;
  try {
    connection.query(
      "DELETE FROM users WHERE email =?",
      [email],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "No users with that email" });
        }
        return res.status(200).json({ message: "users delete success" });
      }
    );
  } catch (error) {
    console.log(err);
    res.status(500).send();
  }
});

app.listen(3000, () => console.log("Connect server successfully"));
