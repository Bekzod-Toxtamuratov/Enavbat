const pool = require("../config/db");

const addToken = async (req, res) => {
  console.log("dad");

  const { table_name, user_id, user_os, user_device, hashed_refresh_token } =
    req.body;

  console.log("user_id", user_id);

  try {
    const newToken = await pool.query(
      `
     INSERT INTO  token (table_name,user_id,user_os,user_device,hashed_refresh_token)
     VALUES($1,$2,$3,$4,$5) RETURNING *
    `,
      [table_name, user_id, user_os, user_device, hashed_refresh_token]
    );
    console.log(newToken.rows[0]);

    res.status(201).send(newToken.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllToken = async (req, res) => {
    console.log('afa');
  try {
    const alltoken = await pool.query(
      `
        SELECT * FROM token
        `
    );
    return res.status(200).send(alltoken.rows);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error });
  }
};
const getTokenById = async (req, res) => {
  const { id } = req.params;
  try {
    const tokenByid = await pool.query("SELECT * FROM token WHERE id = $1", [
      id,
    ]);
    if (tokenByid.rows.length == 0) {
      return res.status(404).send({ message: "token not found" });
    }
    res.status(200).send({ token: tokenByid.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateToken = async (req, res) => {
  const { table_name, user_id, user_os, user_device, hashed_refresh_token } =
    req.body;
  const { id } = req.params;
  try {
    const updatesToken = await pool.query(
      `
        UPDATE token set table_name=$1, user_id=$2, user_os=$3,user_device=$4,
        hashed_refresh_token=$5  WHERE id=$6
        `,
      [table_name, user_id, user_os, user_device, hashed_refresh_token, id]
    );
    if (updatesToken.rowCount == 0) {
      return res.status(404).send({ message: "token not found" });
    }
    return res.status(201).send({ message: "successfully updated " });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error });
  }
};

const deleteToken = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteToken = await pool.query(
      `
        DELETE FROM token WHERE id=$1
        `,
      [id]
    );
    if (deleteToken.rowCount == 0) {
      return res.status(404).send({ message: "token not found" });
    }
    return res.status(201).send({ message: "deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(403).send(error);
  }
};

module.exports = {
  addToken,
  getTokenById,
  getAllToken,
  deleteToken,
  updateToken,
};
