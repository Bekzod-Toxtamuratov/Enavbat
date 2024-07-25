const pool = require("../config/db");

const DeviceDetector = require("node-device-detector");
const DeviceHelper = require("node-device-detector/helper");

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: true,
});

const addClient = async (req, res) => {
  const { first_name, last_name, phone_number, info, photo } = req.body;
  try {
    const newClient = await pool.query(
      `
    INSERT INTO client(first_name, last_name, phone_number, info, photo)
    VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
      [first_name, last_name, phone_number, info, photo]
    );
    console.log(newClient.rows[0]);
    res.status(201).send(newClient.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllClient = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"]; 
    console.log("userAgent :   :   ",userAgent);

    const result = detector.detect(userAgent);

    console.log("result parse ", result);
    // console.log(DeviceHelper.isMobile(result)); // => bu telofon uchun true beradl
    // console.log(DeviceHelper.isDesktop(result));   => bu kompyuter uchun true beradi;

    const clients = await pool.query("SELECT * FROM client");
    res.status(200).send(clients.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.query("SELECT * FROM client WHERE id = $1", [id]);

    if (client.rows.length == 0) {
      return res.status(404).send({ message: "client not found" });
    }

    res.status(200).send(client.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
const updateClient = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { first_name, last_name, phone_number, info, photo } = req.body;
  try {
    const updatedClient = await pool.query(
      `
            UPDATE client SET first_name = $1, last_name = $2, phone_number = $3, info = $4, photo = $5 WHERE id = $6
            RETURNING *
            `,
      [first_name, last_name, phone_number, info, photo, id]
    );
    console.log("updatedClient.rows : ", updatedClient.rows);

    if (updatedClient.rows.length == 0) {
      res.status(404).send({ message: "client not found" });
    }

    res.status(200).send(updatedClient.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedClient = await pool.query(
      `
            DELETE FROM client WHERE id = $1
            RETURNING *
            `,
      [id]
    );
    if (deletedClient.rows.length == 0) {
      return res.status(404).send({ message: "client not found" });
    }
    res.status(200).send(deletedClient.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addClient,
  getAllClient,
  getClientById,
  updateClient,
  deleteClient,
};
