const pool = require("../config/db");

const { adminValidation } = require("../validations/admin.validation");

const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    console.log("value  :  ", value);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { name, phone_number, email, hashed_password } = value;

    // const { name, phone_number, email, hashed_password } = req.body;

    const newAdmin = await pool.query(
      `
    INSERT INTO admin (name,phone_number,email,hashed_password)
    VALUES($1, $2, $3, $4) RETURNING *
    `,
      [name, phone_number, email, hashed_password]
    );

    console.log(newAdmin.rows[0]);
    res.status(201).send(newAdmin.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const admins = await pool.query("SELECT * FROM admin");
    res.status(200).send(admins.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await pool.query("SELECT * FROM admin WHERE id = $1", [id]);

    if (admin.rows.length == 0) {
      return res.status(404).send({ message: "admin not found" });
    }

    res.status(200).send(admin.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { name, phone_number, email, hashed_password } = req.body;
  try {
    const updatedAdmin = await pool.query(
      `
            UPDATE admin SET name = $1, phone_number = $2,email = $3, hashed_password=$4 WHERE id = $5
            RETURNING *
            `,
      [name, phone_number, email, hashed_password, id]
    );
    console.log("updatedAdmin.rows : ", updatedAdmin.rows);

    if (updatedAdmin.rows.length == 0) {
      return res.status(404).send({ message: "admin not found" });
    }

    res.status(200).send(updatedAdmin.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAdmin = await pool.query(
      `
            DELETE FROM admin WHERE id = $1
            RETURNING *
            `,
      [id]
    );

    if (deletedAdmin.rows.length == 0) {
      return res.status(404).send({ message: "admin not found" });
    }

    res.status(200).send(deletedAdmin.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addAdmin,
  getAdminById,
  getAllAdmin,
  updateAdmin,
  deleteAdmin,
};
