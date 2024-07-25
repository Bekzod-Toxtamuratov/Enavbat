const pool = require("../config/db");

const addSpec_working_day = async (req, res) => {
  const {
    start_time,
    finish_time,
    rest_start_time,
    day_of_week,
    spec_id,
    rest_finish_time,
  } = req.body;
  console.log("day_of_week", day_of_week);

  try {
    const newSpec_working_day = await pool.query(
      `
      INSERT INTO spec_working_day (spec_id,day_of_week,start_time,finish_time, rest_start_time, rest_finish_time)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `,
      [
        spec_id,
        day_of_week,
        start_time,
        finish_time,
        rest_start_time,
        rest_finish_time,
      ]
    );
    console.log(newSpec_working_day.rows[0]);
    res.status(201).send(newSpec_working_day.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllSpec_working_day = async (req, res) => {
  try {
    const spec_working_days = await pool.query(
      "SELECT * FROM spec_working_day"
    );
    res.status(200).send(spec_working_days.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllSpec_working_dayById = async (req, res) => {
  const { id } = req.params;
  try {
    const spec_working_days = await pool.query(
      "SELECT * FROM spec_working_day WHERE id = $1",
      [id]
    );

    if (spec_working_days.rows.length == 0) {
      return res.status(404).send({ message: "spec_working_day not found" });
    }

    res.status(200).send(spec_working_days.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateSpec_working_day = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const {
    start_time,
    finish_time,
    rest_start_time,
    day_of_week,
    spec_id,
    rest_finish_time,
  } = req.body;
  try {
    const updateSpec_working_day = await pool.query(
      `
            UPDATE spec_working_day SET start_time = $1, finish_time = $2,rest_start_time = $3, day_of_week=$4,spec_id=$5, 
            rest_finish_time=$6

            WHERE id = $7
            RETURNING *
            `,
      [
        start_time,
        finish_time,
        rest_start_time,
        day_of_week,
        spec_id,
        rest_finish_time,
        id,
      ]
    );
    console.log("updateSpec_working_day.rows : ", updateSpec_working_day.rows);

    if (updateSpec_working_day.rows.length == 0) {
      return res.status(404).send({ message: "spec_working_day not found" });
    }

    res.status(200).send(updateSpec_working_day.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteSpec_working_day = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSpec_working_day = await pool.query(
      `
            DELETE FROM spec_working_day WHERE id = $1
            RETURNING *
            `,
      [id]
    );

    if (deletedSpec_working_day.rows.length == 0) {
      return res.status(404).send({ message: "spec_working_day  not found" });
    }

    res.status(200).send(deletedSpec_working_day.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addSpec_working_day,
  getAllSpec_working_day,
  getAllSpec_working_dayById,
  updateSpec_working_day,
  deleteSpec_working_day,
};
