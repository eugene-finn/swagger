const db = require('../db');
const uuidv4 = require('uuid/v4');
const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  email: Joi.string().email({ minDomainSegments: 2 })
});

const resultItemConverter = (item) => {
  return {
    id: item.id,
    username: item.username,
    email: item.email
  }
}

exports.getAll = () => new Promise(async (resolve, reject) => {
  try {
    let result = db.get('users').value();

    resolve(result.map((item) => resultItemConverter(item)));
  }
  catch (err) {
    reject(err);
  }
});

exports.add = ({ username, email, password }) => new Promise(async (resolve, reject) => {
  try {
    const { error, value } = Joi.validate({ username, email, password }, schema);
    if (error) {
      return reject(error);
    }

    const id = uuidv4();
    const newUser = {
      id,
      username,
      email,
      password
    };

    db.get('users')
      .push(newUser)
      .write();

    resolve(newUser);
  }
  catch (err) {
    reject(err);
  }
});

exports.get = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    if (!id) {
      return reject('id is required');
    }
    const result = db.get('users')
      .find({ id })
      .value();

    resolve(result);
  }
  catch (err) {
    reject(err);
  }
});

exports.update = ({ id, username, email }) => new Promise(async (resolve, reject) => {
  try {
    if (!id) {
      return reject('id is required');
    }

    const { error, value } = Joi.validate({ username, email }, schema);
    if (error) {
      return reject(error);
    }

    let newUser = {};
    if (username) newUser.username = username;
    if (email) newUser.email = email;

    db.get('users')
      .find({ id })
      .assign(newUser)
      .write();

    const updatedUser = await exports.get({ id });

    resolve(updatedUser);
  }
  catch (err) {
    reject(err);
  }
});

exports.delete = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    if (!id) {
      return reject('id is required');
    }
    const result = db.get('users')
      .remove({ id })
      .write();

    resolve(true);
  }
  catch (err) {
    reject(err);
  }
});
