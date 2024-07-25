if (specResult.rows.length == 0) {
  const newSpecialist = await pool.query(
    `
            INSERT INTO specialist(phone_number, otp_id, is_active)
            VALUES($1, $2, true) RETURNING id;`,
    [check, decoded_data.otp_id]
  );
  spec_id = newSpecialist.rows[0].id;
  details2 = "new";
} else {
  spec_id = newSpecialist.rows[0].id;
  details2 = "old";
  await pool.query(
    `Update specialist SET otp_id = $2, is_active=true where id = $1`,
    [spec_id, decoded_data.otp_id]
  );
}
const specResult = await pool.query(
  `SELECT * from specialist where phone_number = $1`,
  [check]
);
