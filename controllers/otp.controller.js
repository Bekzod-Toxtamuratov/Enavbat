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

const newOTP = async (req, res) => {
  const { phone_number } = req.body;

  // console.log("phone_number: " + phone_number);

  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  // console.log("otp :", otp);

  const now = new Date();
  const expiration_time = addMinutesToDate(now, 3);
  const newOtp = await pool.query(
    `
  INSERT INTO otp(id, otp, expiration_time)
  VALUES($1, $2, $3) RETURNING id;
  `,
    [uuidv4(), otp, expiration_time]
  );

  // console.log("newotp  :", newOtp);
  // Sms yoki bot yoki email  korinishida yuborib qoyishimiz munkin boladi
  // kiritilgan telofon raqamiga 4talik otp yuborib qoyishimiz kerak boladi bu yerda;

  const details = {
    timestamp: now,
    check: phone_number,
    success: true,
    message: "Otp sent to client",
    otp_id: newOtp.rows[0].id,
  };

  const encoded = await encode(JSON.stringify(details));

  // console.log("encodeded  :  ", encoded);
  // encoded bizda shifrlargan malumot hisoblanadi;

  return res.send({
    Status: "Success",
    Details: encoded,
  });
};
// otpNew tugadi metodi bu yerda;

const verifyOTP = async (req, res) => {
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
  // console.log(
  //   "decoded_data.check  :  :",
  //   decoded_data.check,
  //   "check : ",
  //   check
  // );
  console.log("decoded_data   : :   : ", decoded_data);
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
  // console.log(result.otp);
  if (result != null) {
    if (result.verified != true) {
      if (result.expiration_time > currentDate) {
        if (otp === result.otp) {
          await pool.query(
            `
            UPDATE otp SET verified = $2 WHERE id = $1`,
            [result.id, true]
          );
          const clientResult = await pool.query(
            `SELECT * from client where phone_number = $1`,
            [check]
          );

          let client_id, details;

          if (clientResult.rows.length == 0) {
            const newClient = await pool.query(
              `
            INSERT INTO client(phone_number, otp_id, is_active)
            VALUES($1, $2, true) RETURNING id;`,
              [check, decoded_data.otp_id]
            );

            // console.log("newClient :", newClient);
            client_id = newClient.rows[0].id;
            details = "new";
          } else {
            client_id = clientResult.rows[0].id;
            details = "old";
            await pool.query(
              `Update client SET otp_id = $2, is_active=true where id = $1`,
              [client_id, decoded_data.otp_id]
            );
          }

          const payload = {
            id: client_id,
          };
          const tokens = myJwt.generateTokens(payload);

          const hashedRefreshToken = bcrypt.hashSync(tokens.refreshToken, 7);
          const userAgent = req.headers["user-agent"];

          const resUserAgent = detector.detect(userAgent);

          const { os, client, device } = resUserAgent;

          await pool.query(
            `
                INSERT INTO token(table_name,user_id, user_os,user_device,user_browser,hashed_refresh_token) 
                VALUES($1, $2, $3, $4, $5, $6)
              `,
            ["client", client_id, os, device, client, hashedRefreshToken]
          );

          res.cookie("refresh_token", tokens.refreshToken, {
            maxAge: config.get("refresh_ms"),
            httpOnly: true,
          });

          const response = {
            Status: "Success",
            Details: details,
            Check: check,
            ClientId: client_id,
            tokens: tokens,
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
const getAllOTP = async (req, res) => {
  try {
    const opts = await pool.query(
      `
        SELECT * FROM  otp
        `
    );
    return res.status(200).send(opts.rows);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error });
  }
};
const getOTPById = async (req, res) => {
  const { id } = req.params;
  try {
    const otps = await pool.query("SELECT * FROM otp WHERE id = $1", [id]);
    if (otps.rows.length == 0) {
      return res.status(404).send({ message: "otp not found" });
    }
    res.status(200).send({ otp: otps.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// ustozda yo'q edi;
const updateOTP = async (req, res) => {
  const { otp } = req.body;
  console.log(otp);

  const { id } = req.params;
  try {
    const updateOTp = await pool.query(
      `
        UPDATE otp set  otp=$1  where id=$2
        `,
      [otp, id]
    );
    if (updateOTp.rowCount == 0) {
      return res.status(404).send({ message: "otp not found" });
    }
    return res.status(201).send({ message: "successfully updated " });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error });
  }
};

// ozim yozganim bu;

// const deleteOTP = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deleteQueue = await pool.query(
//       `
//         DELETE FROM otp WHERE id=$1
//         `,
//       [id]
//     );
//     if (deleteQueue.rowCount == 0) {
//       return res.status(404).send({ message: "otp not found" });
//     }
//     return res.status(201).send({ message: "deleted successfully" });
//   } catch (error) {
//     console.log(error);
//     return res.status(403).send(error);
//   }
// };



const deleteOTP = async (req, res) => {
  const { verifiaction_key, check } = req.body;

  console.log(verifiaction_key, check);
  console.log("dad");

  let decoded;
  try {
    decoded = await decode(verifiaction_key);
    // console.log("decoded :", decoded);
  } catch (error) {
    const response = { Status: "Failure", Message: "Bad request" };
    return res.status(400).send(response);
  }

  let decoded_data = JSON.parse(decoded);
  const check_decoded_data = decoded_data.check;

  console.log("ok", decoded_data);

  if (check_decoded_data != check) {
    const response = {
      Status: "Failure",
      Details: "OTP was not sent to this particular phone number",
    };
    return res.status(400).send(response);
  }
  let params = {
    id: decoded_data.otp_id,
  };

  const deleteOTP = await pool.query(
    `DELETE FROM otp WHERE id=$1, RETURNING id`,
    [params.id]
  );
  if (deleteOTP.rows.length == 0) {
    return res.status(404).send("Invalid otp");
  }
  return res.status(201).send("OTP deleted successfully");
};

module.exports = {
  newOTP,
  verifyOTP,
  getAllOTP,
  getOTPById,
  deleteOTP,
  updateOTP,
};
