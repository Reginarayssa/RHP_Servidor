const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Backend está funcionando  S2 corretamente' });
});

module.exports = router;
