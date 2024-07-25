const pool = require("../config/db");

const addQueue = async (req, res) => {
  const { spec_service_id, client_id, queue_date_time, queue_number } =
    req.body;

  try {
    const newQueue = await pool.query(
      `
      INSERT INTO  queue(spec_service_id,client_id,queue_date_time,queue_number)
      VALUES($1,$2,$3,$4) RETURNING *
    `,
      [spec_service_id, client_id, queue_date_time, queue_number]
    );
    console.log(newQueue.rows[0]);

    res.status(201).send(newQueue.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllQueue = async (req, res) => {
  try {
    const queues = await pool.query(
      `
        SELECT * FROM  queue
        `
    );
    return res.status(200).send(queues.rows);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error });
  }
};
const getQueusById = async (req, res) => {
  const { id } = req.params;
  try {
    const queues = await pool.query("SELECT * FROM queue WHERE id = $1", [id]);
    if (queues.rows.length == 0) {
      return res.status(404).send({ message: "queue not found" });
    }
    res.status(200).send({ queues: queues.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateQueue = async (req, res) => {
  const { spec_service_id, client_id, queue_date_time, queue_number } =
    req.body;
  const { id } = req.params;
  try {
    const updateQueue = await pool.query(
      `
        UPDATE queue set spec_service_id=$1, client_id=$2, queue_date_time=$3,queue_number=$4 WHERE id=$5
        `,
      [spec_service_id, client_id, queue_date_time, queue_number, id]
    );
    if (updateQueue.rowCount == 0) {
      return res.status(404).send({ message: "queuqe not found" });
    }
    return res.status(201).send({ message: "successfully updated " });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error });
  }
};

const deleteQueue = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteQueue = await pool.query(
      `
        DELETE FROM queue WHERE id=$1
        `,
      [id]
    );
    if (deleteQueue.rowCount == 0) {
      return res.status(404).send({ message: "queue not found" });
    }
    return res.status(201).send({ message: "deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(403).send(error);
  }
};

module.exports = {
  addQueue,
  getAllQueue,
  getQueusById,
  updateQueue,
  deleteQueue,
};
