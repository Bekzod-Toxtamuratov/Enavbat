const pool = require("../config/db");

const addService = async (req, res) => {
  const { service_name, service_price } = req.body;
  try {
    const newService = await pool.query(
      `
     INSERT INTO service (service_name,service_price)
     VALUES($1,$2) RETURNING *
    `,
      [service_name, service_price]
    );
    console.log(newService.rows[0]);

    res.status(201).send(newService.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllService = async (req, res) => {
  try {
    const services = await pool.query("SELECT * FROM service");

    res.status(200).send(services.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const services = await pool.query("SELECT * FROM service WHERE id = $1", [
      id,
    ]);
    if (services.rows.length == 0) {
      return res.status(404).send({ message: "service not found" });
    }
    res.status(200).send(services.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { service_name, service_price } = req.body;
  try {
    const updatedService = await pool.query(
      `
        UPDATE service SET service_name = $1, service_price = $2  WHERE id = $3
        RETURNING *
        `,
      [service_name, service_price, id]
    );
    console.log("updatedService.rows : ", updatedService.rows);

    if (updatedService.rows.length == 0) {
      return res.status(404).send({ message: "service not found" });
    }

    res.status(200).send(updatedService.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedService = await pool.query(
      `
            DELETE FROM service WHERE id = $1
            RETURNING *
            `,
      [id]
    );
    if (deletedService.rows.length == 0) {
      return res.status(404).send({ message: "service not found" });
    }

    res.status(200).send(deletedService.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addService,
  getServiceById,
  getAllService,
  updateService,
  deleteService,
};
