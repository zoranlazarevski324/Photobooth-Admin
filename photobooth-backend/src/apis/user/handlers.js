import models from "../../db";
import uuid from 'uuid'
import dotenv from 'dotenv'
import Sequelize from "sequelize";
dotenv.config();

export const list = async (req, res) => {
    const offset = req.body.offset || 0
    const limit = req.body.limit || 5
    const search = req.body.search || ''
    const sortField = req.body.sortField || 'company_name'
    const sortDirection = req.body.sortDirection || 'ASC'

    var where = {}

    where[Sequelize.Op.or] = [{
        company_name: {
            [Sequelize.Op.like]: `%${search}%`
        }
    }, {
        contact_first_name: {
            [Sequelize.Op.like]: `%${search}%`
        }
    }, {
        contact_last_name: {
            [Sequelize.Op.like]: `%${search}%`
        }
    }, {
        email: {
            [Sequelize.Op.like]: `%${search}%`
        }
    }, {
        contact_phone: {
            [Sequelize.Op.like]: `%${search}%`
        }
    }];

    const clients = await models.User.findAndCountAll({
        where,
        order: [[sortField, sortDirection]],
        limit,
        offset
    });

    res.send(JSON.stringify({success: true, result: {pagination: models.User.pagination(clients.count, limit, offset), rows: clients.rows}}))
    res.end()
}

export const select = async (req, res) => {
    const id = req.query.id

    const client = await models.User.findOne({
        where: {
            id: id
        }
    })
    res.send(JSON.stringify({success: true, result: client}))
    res.end()
}

export const deleteUser = async (req, res) => {
    const id = req.query.id
    await models.User.destroy({where: {id}})

    res.send({success: true})
    res.end()
}

export const editSave = async (req, res) => {
    let id = req.body.id || ''
    const isNew = id === '' ? true : false
    const company_name = req.body.company_name
    const contact_first_name = req.body.contact_first_name
	const contact_last_name = req.body.contact_last_name
    const email = req.body.email
    const contact_phone = req.body.contact_phone
	const password = req.body.password
    const logo = req.files && req.files.logo

    if(isNew && logo === undefined){
        return res.status(400).send('No file was uploaded.');
    }

    if(isNew)   id = uuid()
    
	const filename = '/logos/user/' + id + '.jpg'

    if(logo){
        try {
            logo.mv(appRoot + '/images' + filename);
        } catch(error){
			console.log(error)
            return res.status(500).send(error);
        }
    }

    if(isNew){
        var data = {
            id: id,
            email: email,
            company_name: company_name,
            contact_first_name: contact_first_name,
			contact_last_name: contact_last_name,
            contact_phone: contact_phone,
			password: password,
			logo: filename
        }
        await models.User.create(data)
    } else {
        var data = {
            email: email,
            company_name: company_name,
            contact_first_name: contact_first_name,
			contact_last_name: contact_last_name,
            contact_phone: contact_phone,
        }

        if(logo)    data.logo = filename

		if(password !== '') data.password = password
        await models.User.update(data, {
            where: {id}
        })
    }
    res.status(200).send({success: true})
}

export const setActive = async (req, res) => {
    const id = req.body.id
    const state = req.body.state
    if(id === undefined){
        res.status(400).send('No id was selected.')
        return 
    }

    await models.User.update({
        active: state ? 1 : 0
    }, {
        where: {id: id}
    })

    const client = await models.User.findOne({
        where: {
            id: id
        }
    })
    res.send(JSON.stringify({success: true, state: client.active === 1 ? true : false}))
    res.end()
}

const renderDate = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const cur = new Date(date)
    return cur.getDate() + ' ' + months[cur.getMonth()] + ' ' + cur.getFullYear()
}

export const exportClients = async (req, res) => {
    const clients = await models.User.findAll()

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
    worksheet.cell(1, 2).string('E-Mail').style(style)
    worksheet.cell(1, 3).string('Password').style(style)
    worksheet.cell(1, 4).string('Company Name').style(style)
    worksheet.cell(1, 5).string('Contact Name').style(style)
    worksheet.cell(1, 6).string('Contact Phones').style(style)
    worksheet.cell(1, 7).string('Date Added').style(style)

    clients.forEach((client, index) => {
        worksheet.cell(index + 2, 1).string((index+1).toString()).style(style)
        worksheet.cell(index + 2, 2).string(client.email).style(style)
        worksheet.cell(index + 2, 3).string(client.password).style(style)
        worksheet.cell(index + 2, 4).string(client.company_name).style(style)
        worksheet.cell(index + 2, 5).string(client.contact_first_name + ' ' + client.contact_last_name).style(style)
        worksheet.cell(index + 2, 6).string(client.contact_phone).style(style)
        worksheet.cell(index + 2, 7).string(renderDate(client.createdAt)).style(style)
    })

    try {
        const buffer = await workbook.writeToBuffer()
        res.write(buffer)
    } catch (error) {
        res.status(500).send({error: error.toString()})    
    }
    res.end()
}

export const totallist = async (req, res) => {
    const clients = await models.User.findAll({
        where: {
            roll: 0
        }
    });

    res.send(JSON.stringify({success: true, result: clients}))
    res.end()
}