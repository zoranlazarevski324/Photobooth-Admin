import bodyParser from 'body-parser'

var urlencodedParser = bodyParser.urlencoded({ extended: false })  

var handlers = require('./handlers')
var express = require('express');
var router = express.Router();

router.post('/', handlers.listEvent)
router.post('/list', handlers.listEvent)
router.get('/select', handlers.selectEvent)
router.get('/delete', handlers.deleteEvent)
router.post('/active', handlers.activeEvent)
router.get('/clone', handlers.cloneEvent)
router.get('/export', handlers.exportEvent)
router.get('/export-image', handlers.exportEventImage)
router.post('/save', urlencodedParser, handlers.saveEvent)

router.post('/adduser', handlers.addUser)
router.get('/deleteuser', handlers.deleteUser)
router.get('/listuser', handlers.userlist)
router.post('/login', handlers.loginUser)
router.post('/listofuser', handlers.listByUser)		// by email
router.post('/addsubmission', handlers.addSubmission)
router.get('/selectsubmission', handlers.selectSubmission)

//export this router to use in our index.js
module.exports = router;