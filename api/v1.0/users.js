var express = require('express');
var router = express.Router();

const usersCtrl = require('../../controllers/users');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const result = await usersCtrl.getAll();
    res.json({
      data: result
    });
  }
  catch (err) {
    console.error("err", err);
    res.status(400).json({
      message: err
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await usersCtrl.add({ ...req.body });
    res.json({
      data: result
    });
  }
  catch (err) {
    console.error("err", err);
    res.status(400).json({
      message: err
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await usersCtrl.get({ ...req.params });
    res.json({
      data: result
    });
  }
  catch (err) {
    console.error("err", err);
    res.status(400).json({
      message: err
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const result = await usersCtrl.update({ ...req.params, ...req.body });
    res.json({
      data: result
    });
  }
  catch (err) {
    console.error("err", err);
    res.status(400).json({
      message: err
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await usersCtrl.delete({ ...req.params });
    res.json({
      data: result
    });
  }
  catch (err) {
    console.error("err", err);
    res.status(400).json({
      message: err
    });
  }
});


module.exports = router;
