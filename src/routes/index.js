const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Backend está funcionando corretamente' });
});

module.exports = router;
