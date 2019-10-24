import bodyParser from 'body-parser'

var urlencodedParser = bodyParser.urlencoded({ extended: false })  

var handlers = require('./handlers')
var express = require('express');
var router = express.Router();

router.post('/', handlers.list)
router.post('/list', handlers.list)
router.get('/select', handlers.select)
router.get('/delete', handlers.deleteUser)
router.post('/active', handlers.setActive)
router.post('/edit', urlencodedParser, handlers.editSave)
router.get('/totallist', handlers.totallist)
router.get('/export', handlers.exportClients)

//export this router to use in our index.js
module.exports = router;
