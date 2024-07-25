const pool = require("../config/db");

const addSpec_service = async (req, res) => {
  console.log("dad");
  const { spec_id, service_id, spec_service_price } = req.body;

  try {
    const newSpec_service = await pool.query(
      `
     INSERT INTO spec_service (spec_id,service_id,spec_service_price)
     VALUES($1,$2,$3) RETURNING *
    `,
      [spec_id, service_id, spec_service_price]
    );
    console.log(newSpec_service.rows[0]);

    res.status(201).send(newSpec_service.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllSpec_service = async (req, res) => {
  try {
    const Spec_service = await pool.query(
      `
        SELECT * FROM  spec_service
        `
    );
    return res.status(200).send(Spec_service.rows);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error });
  }
};
const getSpec_ServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const spec_services = await pool.query(
      "SELECT * FROM spec_service WHERE id = $1",
      [id]
    );
    if (spec_services.rows.length == 0) {
      return res.status(404).send({ message: "spec_service not found" });
    }
    res.status(200).send({ spec_serivce: spec_services.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateSpec_serivce = async (req, res) => {
  const { spec_id, service_id, spec_service_price } = req.body;

  const { id } = req.params;
  try {
    const updatespec_service = await pool.query(
      `
        UPDATE spec_service set spec_id=$1, service_id=$2, spec_service_price=$3 WHERE id=$4
        `,
      [spec_id, service_id, spec_service_price, id]
    );
    if (updatespec_service.rowCount == 0) {
      return res.status(404).send({ message: "spec_service not found" });
    }
    return res.status(201).send({ message: "successfully updated " });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error });
  }
};

const deleteSpec_service = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSpec_service = await pool.query(
      `
        DELETE FROM spec_service WHERE id=$1
        `,
      [id]
    );
    if (deleteSpec_service.rowCount == 0) {
      return res.status(404).send({ message: "spec_service not found" });
    }
    return res.status(201).send({ message: "deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(403).send(error);
  }
};

module.exports = {
  addSpec_service,
  getAllSpec_service,
  getSpec_ServiceById,
  updateSpec_serivce,
  deleteSpec_service,
};
