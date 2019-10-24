import models from "../../db";
import uuid from 'uuid';
import dotenv from 'dotenv';
import Sequelize from "sequelize";
dotenv.config();
const fs = require('fs');
const stat = fs.statSync;
const AdmZip = require('adm-zip');

export const listEvent = async (req, res) => {
    const offset = req.body.offset || 0
    const limit = req.body.limit || 5
    const search = req.body.search || ''
    const sortField = req.body.sortField || 'name'
    const sortDirection = req.body.sortDirection || 'ASC'
    const roll = req.body.roll
    const client_id = req.body.client_id

    var order = null
    switch(sortField){
    	case 'name':
    		order = [['name', sortDirection]]
    		break
    	case 'daterange':
    		order = [['start', sortDirection], ['end', sortDirection]]
    		break
    	case 'client':
    		order = [[Sequelize.literal("concat(contact_first_name, ' ', contact_last_name)"), sortDirection]]
    		break
    	default:
    		order = [['name', sortDirection]]
    }

    var where = {}

    if(roll === 0){
    	where = {
    		where: {
    			client_id,
    			[Sequelize.Op.or]: [
    				Sequelize.literal("Event.name like '%" + search + "%'"),
    				Sequelize.literal("concat(contact_first_name, ' ', contact_last_name) like '%" + search + "%'")
    			]
    		}
    	}
    }else {
	    where[Sequelize.Op.or] = [
	    	Sequelize.literal("Event.name like '%" + search + "%'"),
	    	Sequelize.literal("concat(contact_first_name, ' ', contact_last_name) like '%" + search + "%'")
	    ]
	}

    const events = await models.Event.findAndCountAll({
    	include: [{
    		model: models.User,
    		attributes: [
    			'company_name',
    			[Sequelize.literal("concat(contact_first_name, ' ', contact_last_name)"), 'full_name']
    		]
    	}],
        order: order,
        where,
        limit,
        offset,
    });

    res.send(JSON.stringify({success: true, result: {pagination: models.User.pagination(events.count, limit, offset), rows: events.rows}}))
	res.end()
}

export const selectEvent = async (req, res) => {
	const id = req.query.id

    const client = await models.Event.findOne({
        where: {
            id: id
        }
    })
    res.send(JSON.stringify({success: true, result: client}))
	res.end()
}

export const deleteEvent = async (req, res) => {
	const id = req.query.id
    await models.Event.destroy({where: {id}})

    res.send({success: true})
	res.end()
}

export const activeEvent = async (req, res) => {
	const id = req.body.id
    const state = req.body.state
    if(id === undefined){
        res.status(400).send('No id was selected.')
        return 
    }

    await models.Event.update({
        active: state ? 1 : 0
    }, {
        where: {id: id}
    })

    const client = await models.Event.findOne({
        where: {
            id: id
        }
    })
    res.send(JSON.stringify({success: true, state: client.active === 1 ? true : false}))
    res.end()
}

export const saveEvent = async (req, res) => {
	var event = req.body

	const logo = req.files && req.files.logo
	const photoframe1 = req.files && req.files.photoframe1
	const photoframe2 = req.files && req.files.photoframe2
	const photoframe3 = req.files && req.files.photoframe3
	const photoframe4 = req.files && req.files.photoframe4

	const isNew = event.id === '' ? true : false
	const fs = require('fs')

	if(isNew && logo === undefined){
        return res.status(400).send('No file was uploaded.');
    }

    if(isNew)   event.id = uuid()
	
	const logoFilename = '/logos/event/' + uuid() + '.jpg'
	if(logo){
        try {
            const path = appRoot + '/images' + logoFilename
        	if(fs.existsSync(path))
                fs.unlinkSync(path)

            logo.mv(path);
            event.logo = logoFilename
        } catch(error){
			console.log(error)
            return res.status(500).send(error);
        }
    }

    const photoframe1Filename = '/logos/photoframe1/' + uuid() + '.jpg'
	if(photoframe1){
        try {
            const path = appRoot + '/images' + photoframe1Filename
            if(fs.existsSync(path))
                fs.unlinkSync(path)

            photoframe1.mv(path);
            event.photoframe1 = photoframe1Filename
        } catch(error){
			console.log(error)
            return res.status(500).send(error);
        }
    }

    const photoframe2Filename = '/logos/photoframe2/' + uuid() + '.jpg'
	if(photoframe2){
        try {
        	const path = appRoot + '/images' + photoframe2Filename
            if(fs.existsSync(path))
                fs.unlinkSync(path)

            photoframe2.mv(path);
            event.photoframe2 = photoframe2Filename
        } catch(error){
			console.log(error)
            return res.status(500).send(error);
        }
    }

    const photoframe3Filename = '/logos/photoframe3/' + uuid() + '.jpg'
	if(photoframe3){
        try {
        	const path = appRoot + '/images' + photoframe3Filename
            if(fs.existsSync(path))
                fs.unlinkSync(path)

            photoframe3.mv(path);
            event.photoframe3 = photoframe3Filename
        } catch(error){
			console.log(error)
            return res.status(500).send(error);
        }
    }

    const photoframe4Filename = '/logos/photoframe4/' + uuid() + '.jpg'
	if(photoframe4){
        try {
        	const path = appRoot + '/images' + photoframe4Filename
            if(fs.existsSync(path))
                fs.unlinkSync(path)

            photoframe4.mv(path);
            event.photoframe4 = photoframe4Filename
        } catch(error){
			console.log(error)
            return res.status(500).send(error);
        }
    }

    const con_id = event.id
    if(isNew){
    	await models.Event.create(event)
    } else {
    	delete event.id
    	await models.Event.update(event, {
    		where: {id: con_id}
    	})
    }
    res.send(JSON.stringify({success: true, id: con_id}))
	res.end()
}

export const cloneEvent = async (req, res) => {
    const id = req.query.id

    let event = await models.Event.findOne({
        where: {
            id: id
        }
    })

    event = event.getInstance()

    if (!event) {
        res.send({success: false, msg: 'There is no such event.'})
        res.end()
        return
    }

    event.id = uuid()
    console.log(event)

    await models.Event.create(event)
    res.send(JSON.stringify({success: true, result: event}))
    res.end()
}

const renderDate = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const cur = new Date(date)
    return cur.getDate() + ' ' + months[cur.getMonth()] + ' ' + cur.getFullYear()
}

export const exportEvent = async (req, res) => {
    const id = req.query.id
    const submissions = await models.Submission.findAll({
        where: {
            event_id: id
        }
    })

    var excel = require('excel4node');
    var workbook = new excel.Workbook();
    var worksheet = workbook.addWorksheet('Client list');

    // Create a reusable style
    var style = workbook.createStyle({
        font: {
            color: '#404040',
            size: 12
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -'
    });

    worksheet.cell(1, 1).string('No').style(style)
    worksheet.cell(1, 2).string('Name').style(style)
    worksheet.cell(1, 3).string('Date Added').style(style)

    submissions.forEach((submission, index) => {
	const sub = submission.getInstance()
        worksheet.cell(index + 2, 1).string((index+1).toString()).style(style)
        worksheet.cell(index + 2, 2).string(sub.name).style(style)
        worksheet.cell(index + 2, 3).string(renderDate(sub.createdAt)).style(style)
    })

    try {
        const buffer = await workbook.writeToBuffer()
        res.write(buffer)
    } catch (error) {
        res.status(500).send({success: false, error: error.toString()})    
    }
    res.end()
}

export const exportEventImage = async (req, res) => {
    const id = req.query.id
    const submissions = await models.Submission.findAll({
        where: {
            event_id: id
        }
    })

    const zip = new AdmZip()
    submissions.map((sub, index) => {
	
        const filePath = appRoot + "/images" + sub.logo
        const p = stat(filePath)
        if (p.isFile()) {
            zip.addLocalFile(filePath)
        }
    })

    res.write(zip.toBuffer())
    res.end()
}

export const addUser = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const event_id = req.body.event_id

    if(email === ''){
        return res.status(400).send('email is empty.');
    }

    if(password === '') {
        return res.status(400).send('password is empty.')
    }

    if(event_id === ''){
        return res.status(400).send('event_id is empty.')   
    }

    const id = uuid()
    await models.EventUser.create({
        id, email, password, event_id
    })

    res.send({success: true})
    res.end()
}

export const deleteUser = async (req, res) => {
    const user_id = req.query.id
    
    await models.EventUser.destroy({
        where: {
            id: user_id
        }
    })

    res.send({success: true})
    res.end()
}

export const userlist = async (req, res) => {
    const event_id = req.query.id

    const users = await models.EventUser.findAll({
        where: {
            event_id
        }
    })

    res.send({success: true, users: users})
    res.end()
}

export const loginUser = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = await models.EventUser.findOne({
        where: {
            email,
            password
        }
    })

    if (user) {
        res.send({success: true, user: user})
    } else {
        res.send({success: false})
    }
    res.end()
}

export const listByUser = async (req, res) => {
    const email = req.body.email

    const eventids = await models.EventUser.findAll({
        where: {
            email
        },
        attributes: ['event_id']
    })
    const ids = eventids.map(id => id.getEventIdInstance())
    const events = await models.Event.findAll({
	where: {
	    id: {
		[Sequelize.Op.in]: ids
	    }
	}
    })

    res.send({success: true, events: events.map(event => event.getInstance())})
    res.end()
}

export const addSubmission = async (req, res) => {
    const name = req.body.name
    const logo = req.files.logo
    const event_id = req.body.event_id

    if(!name || !logo){
        res.status(400).send({success: false, error: "no data"})
        res.end()
        return 
    }

    let submission = {}
    submission.id = uuid()
    submission.name = name
    submission.event_id = event_id
    
    const logoFilename = '/logos/submission/' + uuid() + '.jpg'
    try {
        const path = appRoot + '/images' + logoFilename
        logo.mv(path);
        submission.logo = logoFilename

        await models.Submission.create(submission)
        res.send({success: true})
    } catch(error) {
        console.log(error)
        return res.status(500).send({success: false, error});
    }
}

export const selectSubmission = async (req, res) => {
    const id = req.query.id

    if (!id) {
        res.status(400).send({success: false, error: "no data"})
        res.end()
        return 
    }

    const submission = await models.Submission.findOne({
        where: { id }
    })

    res.send({success: true, submission})
    res.end()
}
