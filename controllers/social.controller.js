const pool = require("../config/db");

const addSocial = async (req, res) => {
  const { social_name, social_icon_file } = req.body;
  try {
    const newSocial = await pool.query(
      `
     INSERT INTO social (social_name, social_icon_file)
     VALUES($1,$2) RETURNING *
    `,
      [social_name, social_icon_file]
    );
    console.log(newSocial.rows[0]);

    res.status(201).send(newSocial.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllSocial = async (req, res) => {
  try {
    const socials = await pool.query("SELECT * FROM social");

    res.status(200).send(socials.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getSocialById = async (req, res) => {
  const { id } = req.params;
  try {
    const socials = await pool.query("SELECT * FROM social WHERE id = $1", [
      id,
    ]);
    if (socials.rows.length == 0) {
      return res.status(404).send({ message: "social not found" });
    }
    res.status(200).send(socials.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateSocial = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { social_name, social_icon_file } = req.body;
  try {
    const updatedSocial = await pool.query(
      `
        UPDATE social SET social_name = $1, social_icon_file = $2  WHERE id = $3
        RETURNING *
        `,
      [social_name, social_icon_file, id]
    );
    console.log("updatedSocial.rows : ", updatedSocial.rows);

    if (updatedSocial.rows.length == 0) {
      return res.status(404).send({ message: "social not found" });
    }

    res.status(200).send(updatedSocial.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteSocial = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSocial = await pool.query(
      `
            DELETE FROM social WHERE id = $1
            RETURNING *
            `,
      [id]
    );

    if (deletedSocial.rows.length == 0) {
      return res.status(404).send({ message: "social not found" });
    }

    res.status(200).send(deletedSocial.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addSocial,
  getSocialById,
  getAllSocial,
  updateSocial,
  deleteSocial,
};
