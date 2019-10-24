import dotenv from 'dotenv'
import express from 'express'
import * as errors from './errors'
import user from './apis/user'
import event from './apis/event'
import fileUPload from 'express-fileupload'
import cors from 'cors'
import uuid from 'uuid'
import bodyParser from 'body-parser'
import models from './db'

var path = require('path');
global.appRoot = path.resolve(__dirname);

dotenv.config();

const port = process.env.PORT || 4000;

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());
app.use(fileUPload())

app.use('/user', user)
app.use('/event', event)

app.post('/signin', async (req, res, next) => {

    const email = req.body.email
    const password = req.body.password

    const user = await models.User.findOne({
        where: {
            email, 
            password,
            active: 1
        }
    })

    res.send({success: true, login_user: user});
})

app.use('/', express.static(path.join(__dirname, 'images')))

app.listen(port, () => console.log(`App listening on port ${port}`));