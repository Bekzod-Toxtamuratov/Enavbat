const Joi = require("joi");

// const adminFullName = (parent) => {
//   return parent.author_first_name + " " + parent.author_last_name;
// };

exports.adminValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).min(2).max(50),
    phone_number: Joi.string().pattern(new RegExp(/^\d{2}-\d{3}-\d{2}-\d{2}$/)),
    email: Joi.string().email(),
    hashed_password: Joi.string().min(6),

    
    // admin_password: Joi.string().min(6),
    // confirm_password: Joi.ref("admin_password"),
    // admin_email: Joi.string().email(),
    // admin_phone: Joi.string().pattern(new RegExp(/^\d{2}-\d{3}-\d{2}-\d{2}$/)),
    // admin_is_active: Joi.boolean().default(false),
    // admin_is_creator: Joi.boolean().default(false),
    // created_date: Joi.date().less(new Date("2000-01-01")),
    // updated_date: Joi.date().less(new Date("2000-01-01")),

    // author_info: Joi.string(),
    // author_position: Joi.string(),
    // author_photo: Joi.string().default("/author/avatar.png"),
    // is_expert: Joi.boolean().default(false),
    // gender: Joi.string().valid("erkak", "ayol"),
    // birth_year: Joi.number().integer().min(1980).max(2005),
    // referred: Joi.boolean().default(false),
    // refferedDetails: Joi.string().when("referred", {
    //   is: true,
    //   then: Joi.string().required(),
    //   otherwise: Joi.string().optional(),
    // }),
    // coding_lang: Joi.array().items(Joi.string(), Joi.number(), Joi.boolean()),
    // is_yes: Joi.boolean().truthy("YES", "ha").valid(true),
  });
  return schema.validate(data, { abortEarly: false });
};
