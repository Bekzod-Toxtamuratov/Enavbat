const pool = require("../config/db");

const addSpec_Social = async (req, res) => {
  const { spec_id, social_id, link } = req.body;
  //    spec_id   | integer                |           | not null |
  //  social_id
  // spec_social;
  try {
    const newSpec_Social = await pool.query(
      `
     INSERT INTO spec_social (spec_id,social_id,link)
     VALUES($1,$2,$3) RETURNING *
    `,
      [spec_id, social_id, link]
    );
    console.log(newSpec_Social.rows[0]);

    res.status(201).send(newSpec_Social.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllSpec_social = async (req, res) => {
  try {
    const Spec_Socials = await pool.query(
      `
        SELECT * FROM  spec_social
        `
    );
    return res.status(200).send(Spec_Socials.rows);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error });
  }
};
const getSpec_SocialById = async (req, res) => {
  const { id } = req.params;
  try {
    const spec_social = await pool.query(
      "SELECT * FROM spec_social WHERE id = $1",
      [id]
    );
    if (spec_social.rows.length == 0) {
      return res.status(404).send({ message: "spec_social not found" });
    }
    res.status(200).send({ Spec_Socials: spec_social.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateSpec_Social = async (req, res) => {
  const { spec_id, social_id, link } = req.body;
  const { id } = req.params;
  try {
    const updatespec_social = await pool.query(
      `
        UPDATE spec_social set spec_id=$1, social_id=$2, link=$3 WHERE id=$4
        `,
      [spec_id, social_id, link, id]
    );
    if (updatespec_social.rowCount == 0) {
      return res.status(404).send({ message: "Spec_Social not found" });
    }
    return res.status(201).send({ message: "successfully updated " });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error });
  }
};

const deleteSpec_Social = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSpec_Social = await pool.query(
      `
        DELETE FROM spec_social WHERE id=$1
        `,
      [id]
    );
    if (deleteSpec_Social.rowCount == 0) {
      return res.status(404).send({ message: "spec_social not found" });
    }
    return res.status(201).send({ message: "deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(403).send(error);
  }
};

module.exports = {
  addSpec_Social,
  getAllSpec_social,
  getSpec_SocialById,
  updateSpec_Social,
  deleteSpec_Social,
};
