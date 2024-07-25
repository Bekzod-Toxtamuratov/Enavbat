const { addMinutesToDate } = require("../helpers/add_minutes");
const otpGenerator = require("otp-generator");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { encode, decode } = require("../helpers/crypt");

const myJwt = require("../service/jwt_service");
const bcrypt = require("bcrypt");

const DeviceDetector = require("node-device-detector");
const DeviceHelper = require("node-device-detector/helper");

const config = require("config");

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: true,
});

const verifyOTPspec = async (req, res) => {
  console.log("verifyOTP ");
  const { verifiaction_key, otp, check } = req.body;
  let currentDate = new Date();
  let decoded;

  try {
    decoded = await decode(verifiaction_key);
    // console.log("decoded :", decoded);
  } catch (error) {
    const response = { Status: "Error", Message: "Bad request" };
    res.status(400).send(response);
  }

  let decoded_data = JSON.parse(decoded);

  // console.log("decoded_data   : :   : ", decoded_data);
  console.log(decoded_data.check, check); // ustoz yozib berdilar;
  if (decoded_data.check != check) {
    const response = {
      Status: "Error",
      Message: "Invalid otp",
    };
    return res.status(400).send(response);
  }
  const otpResult = await pool.query(`select * from otp where id=$1`, [
    decoded_data.otp_id,
  ]);
  // console.log("otpReulst     :  :   :", otpResult);
  const result = otpResult.rows[0];
  console.log("result  :  : ", result);
  console.log("ok:", result.otp);
  if (result != null) {
    if (result.verified != true) {
      if (result.expiration_time > currentDate) {
        if (otp === result.otp) {
          await pool.query(
            `
            UPDATE otp SET verified = $2 WHERE id = $1`,
            [result.id, true]
          );
          const SpecialistResult = await pool.query(
            `SELECT * from specialist where phone_number = $1`,
            [check]
          );

          let spec_id, details;

          if (SpecialistResult.rows.length == 0) {
            const newSpec = await pool.query(
              `
            INSERT INTO specialist(phone_number, otp_id, is_active)
            VALUES($1, $2, true) RETURNING id;`,
              [check, decoded_data.otp_id]
            );

            spec_id = newSpec.rows[0].id;
            details = "new";
          } else {
            spec_id = SpecialistResult.rows[0].id;
            details = "old";
            await pool.query(
              `Update specialist SET otp_id = $2, is_active=true where id = $1`,
              [spec_id, decoded_data.otp_id]
            );
          }

          const payload = {
            id: spec_id,
          };
          const tokens = myJwt.generateTokens(payload);

          const hashedRefreshToken = bcrypt.hashSync(tokens.refreshToken, 7); // refreshtoken heshladik bu yerda biz yana;
          const userAgent = req.headers["user-agent"];

          const resUserAgent = detector.detect(userAgent);

          const { os, client, device } = resUserAgent;

          await pool.query(
            `
                INSERT INTO token(table_name,user_id, user_os,user_device,user_browser,hashed_refresh_token)
                VALUES($1, $2, $3, $4, $5, $6)
              `,
            ["specialist", spec_id, os, device, client, hashedRefreshToken]
          );
           

          // set cookie 
          res.cookie("refresh_token", tokens.refreshToken, {
            maxAge: config.get("refresh_ms"),
            httpOnly: true,
          });

          const response = {
            Status: "Success",
            Details: details,
            Check: check,
            SpecialistId: spec_id,
            tokens:tokens,
          };
          return res.status(200).send(response);
        } else {
          const response = {
            Status: "Error",
            Message: "otp not matched",
          };
          return res.status(400).send(response);
        }
      } else {
        const response = {
          Status: "Failured",
          Message: "OTP expired",
        };
        return res.status(400).send(response);
      }
    } else {
      const response = {
        Status: "Failure",
        Message: "OTP already verified",
      };
      return res.status(400).send(response);
    }
  } else {
    const response = {
      Status: "Failure",
      Details: "Bad request otp not found",
    };
    return res.status(404).send(response);
  }
};

// bu yerdan odiy crud boshlanib ketdi;
const addSpecialist = async (req, res) => {
  const {
    position,
    last_name,
    middle_name,
    birth_day,
    photo,
    phone_number,
    info,
    first_name,
  } = req.body;
  try {
    const newSpecialist = await pool.query(
      `
    INSERT INTO specialist (position,last_name,middle_name,birth_day,photo,phone_number,info,first_name)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `,
      [
        position,
        last_name,
        middle_name,
        birth_day,
        photo,
        phone_number,
        info,
        first_name,
      ]
    );
    console.log(newSpecialist.rows[0]);

    res.status(201).send(newSpecialist.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllSpecialist = async (req, res) => {
  try {
    const admins = await pool.query("SELECT * FROM specialist");
    res.status(200).send(admins.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getSpecialistById = async (req, res) => {
  const { id } = req.params;
  try {
    const newSpecialist = await pool.query(
      "SELECT * FROM specialist WHERE id = $1",
      [id]
    );
    if (newSpecialist.rows.length == 0) {
      return res.status(404).send({ message: "specialist not found" });
    }
    res.status(200).send(newSpecialist.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateSpecialist = async (req, res) => {
  const { id } = req.params;
  console.log("id :", id);
  console.log(id);
  const {
    position,
    last_name,
    middle_name,
    birth_day,
    photo,
    phone_number,
    info,
    first_name,
  } = req.body;
  try {
    const updatespecialist = await pool.query(
      `
     UPDATE specialist SET position = $1,last_name = $2,middle_name = $3,birth_day=$4,photo=$5,phone_number=$6,info=$7,first_name=$8    WHERE id = $9
     RETURNING *
    `,
      [
        position,
        last_name,
        middle_name,
        birth_day,
        photo,
        phone_number,
        info,
        first_name,
        id,
      ]
    );
    console.log("updatespecialist.rows : ", updatespecialist.rows);

    if (updatespecialist.rows.length == 0) {
      return res.status(404).send({ message: "specialist not found" });
    }

    res.status(200).send(updatespecialist.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteSpecialist = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAdmin = await pool.query(
      `
            DELETE FROM specialist WHERE id = $1
            RETURNING *
            `,
      [id]
    );

    if (deletedAdmin.rows.length == 0) {
      return res.status(404).send({ message: "specialist not found" });
    }

    res.status(200).send(deletedAdmin.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addSpecialist,
  getSpecialistById,
  getAllSpecialist,
  updateSpecialist,
  deleteSpecialist,
  verifyOTPspec,
};
