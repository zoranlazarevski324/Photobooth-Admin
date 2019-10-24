import React, { Component } from 'react'
import Loading from '../../components/loading'
import axios from 'axios';
import { Card, CardHeader, CardBody, Collapse, Button, Col, FormGroup, Input, Row, Table } from 'reactstrap';
import YesNo from '../../components/yesno';
import ImageSelector from '../../components/imageselector'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Switch from "react-switch";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config'

class EditEvent extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            signed: false,
            ec_collapse: true,
            pf_collapse: true,
            ema_collapse: true,
            es_collapse: true,
            event: {
                id: '',
                name: '',
                logo: null,
                start: new Date(),
                end: new Date(),
                capture_type: 'jpeg',
                camera_type: 'front',
                cf_first_name: 'yes',
                cf_last_name: 'yes',
                cf_instagram_handle: 'yes',
                cf_email: 'yes',
                cf_telephone: 'yes',
                cf_print_num: 4,
                oo_email: 'yes',
                oo_sms: 'yes',
                oo_print: 'yes',
                photoframe1: null,
                photoframe2: null,
                photoframe3: null,
                photoframe4: null,
                email_subject: '',
                email_body_copy: '',
                sms_message: '',
                client_id: '',
                active: 0
            },
            userlist: [],
            email: '',
            password: ''
        }
    }

    async componentDidMount() {
        this.login_user = JSON.parse(window.localStorage.getItem('login_user'))
        if (this.login_user.roll === 0){
            this.clients = [this.login_user]
        } else {
            const res = await axios.get(config.backendUrl + 'user/totallist')
            this.clients = res.data.result
        }

        const id = this.props.clone === 'clone' ? this.props.id : this.props.match.params.id
        this.setState({id: id ? id : ''})        

        if ( id ) {
            const res = await axios.get(config.backendUrl + (this.props.clone === 'clone' ? 'event/clone?id=' : 'event/select?id=') + id)
            if (res.data.success) {
                this.selectEvent(res.data.result)
                this.loadUserListOfEvent()
            }
        } else {
            this.setState({loading: false})
        }
    }

    loadUserListOfEvent = async () => {
        const res = await axios.get(config.backendUrl + "event/listuser?id=" + this.state.event.id)

        if(res.data.success){
            this.setState({userlist: res.data.users})
        }
    }

    addUser = async () => {
        if(this.state.email === ''){
            alert('Please type email.')
            this.emailRef.focus()
            return
        }

        if(this.state.password === ''){
            alert('Please type password.')
            this.passwordRef.focus()
            return
        }

        const res = await axios.post(config.backendUrl + "event/adduser", {
            email: this.state.email,
            password: this.state.password,
            event_id: this.state.event.id
        })

        if(res.data.success){
            toast.success('User is added to this event successfully.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: false
            })
            this.setState({email: '', password: ''})
            this.loadUserListOfEvent()
        }
    }

    deleteUser = async (id) => {
        if(window.confirm('Are you sure?')) {
            const res = await axios.get(config.backendUrl + "event/deleteuser?id=" + id)
            if(res.data.success){
                toast.success('User Deleting is done successfully.', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    draggable: false
                })
                this.loadUserListOfEvent()
            }
        }
    }

    onSelectUploadfile = () => {
        this.logoFileInput.click();
    }

    onAvatarChange = () => {
        var infile = this.logoFileInput
        if (infile.files && infile.files[0]) {
            var reader = new FileReader()
        
            this.eventState("logo", infile.files[0])
            reader.onload = (e) => {
                this.logoImageRef.src = e.target.result;
            }

            reader.readAsDataURL(infile.files[0]);
        }
    }

    toggle = (value) => {
        const val = this.state[value]
        this.setState({[value]: !val})
    }

    eventState = (name, val) => {
        let event = this.state.event
        event[name] = val
        this.setState({event})
    }

    saveEvent = async () => {
        if(this.state.event.name === ''){
            alert('Please type event name')
            return
        }

        if(this.state.event.id && this.state.event.logo === null){
            alert('Please select event logo')
            return
        }

        if (this.state.event.client_id === ''){
            alert('Please select client.')
            return
        }

        if (this.state.event.start === '') {
            alert('Please select event start date.')
            return
        }

        let form = new FormData()
        form.append('id', this.state.event.id)
        form.append('name', this.state.event.name)
        form.append('start', this.state.event.start)
        form.append('end', this.state.event.end)
        form.append('capture_type', this.state.event.capture_type)
        form.append('camera_type', this.state.event.camera_type)
        form.append('cf_first_name', this.state.event.cf_first_name)
        form.append('cf_last_name', this.state.event.cf_last_name)
        form.append('cf_instagram_handle', this.state.event.cf_instagram_handle)
        form.append('cf_email', this.state.event.cf_email)
        form.append('cf_telephone', this.state.event.cf_telephone)
        form.append('cf_print_num', this.state.event.cf_print_num)
        form.append('oo_email', this.state.event.oo_email)
        form.append('oo_sms', this.state.event.oo_sms)
        form.append('oo_print', this.state.event.oo_print)
        form.append('email_subject', this.state.event.email_subject)
        form.append('email_body_copy', this.state.event.email_body_copy)
        form.append('sms_message', this.state.event.sms_message)
        form.append('client_id', this.state.event.client_id.value)
        form.append('active', this.state.event.active)

        if(this.state.event.logo !== null && typeof this.state.event.logo === 'object')                     form.append('logo', this.state.event.logo)
        if(this.state.event.photoframe1 !== null && typeof this.state.event.photoframe1 === 'object')       form.append('photoframe1', this.state.event.photoframe1)
        if(this.state.event.photoframe2 !== null && typeof this.state.event.photoframe2 === 'object')       form.append('photoframe2', this.state.event.photoframe2)
        if(this.state.event.photoframe3 !== null && typeof this.state.event.photoframe3 === 'object')       form.append('photoframe3', this.state.event.photoframe3)
        if(this.state.event.photoframe4 !== null && typeof this.state.event.photoframe4 === 'object')       form.append('photoframe4', this.state.event.photoframe4)

        const res = await axios.post(config.backendUrl + "event/save", form)
        if (res.data.success){
            const savedResult = await axios.get(config.backendUrl + 'event/select?id=' + res.data.id)
            var event = savedResult.data.result
            this.selectEvent(event)
        }
    }

    selectEvent(event){
        let curClient = null
        this.clients.forEach(client => {
            if(client.id === event.client_id){
                curClient = client
            }
        })

        if(curClient){
            event.client_id = {value: curClient.id, label: curClient.contact_first_name + ' ' + curClient.contact_last_name}
        }

        event.start = new Date(event.start)
        event.end = new Date(event.end)
        this.setState({event, loading: false})
    }

    render () {
        if(this.state.loading) {
            return (
                <Loading />
            )
        }

        return (
            <div className="client-container">
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>
                                <div className="title">
                                    <Row>
                                        <Col xs="8"><span>{ this.state.id ? (this.props.clone ? "New Event" : "Edit Event") : "New Event" }</span></Col>
                                        <Col xs="4" align="right">
                                            <Button type="button" color="success" onClick={() => this.saveEvent()}><i className="fa fa-save"></i> Save Event</Button>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="form-horizontal">

                                    {/* Row for inputting event name */}
                                    <Row>
                                        <Col md="6" sm="6" xs="12">
                                            <FormGroup className="withLabel">
                                                <label className="control-label col-md-4">Event Name:</label>
                                                <div className="col-md-8">
                                                    <Input type="text" id="event_name" name="event_name" value={this.state.event.name} placeholder="Event Name" onChange={(e) => this.eventState("name", e.target.value)}/>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" sm="6" xs="12">
                                            <FormGroup className="withLabel">
                                                <label className="control-label">Active:&nbsp;&nbsp;&nbsp;</label>
                                                <Switch onChange={(state) => this.eventState("active", state ? 1 : 0)} checked={this.state.event.active === 1 ? true : false} />
                                                <div className="gap"></div>
                                                <label className="control-label">Client:&nbsp;&nbsp;&nbsp;</label>
                                                <Select className="clientid"
                                                    value={this.state.event.client_id}
                                                    onChange={(selectedItem) => this.eventState("client_id", selectedItem)}
                                                    options={this.clients.map((item) => {
                                                        return {value: item.id, label: item.contact_first_name + ' ' + item.contact_last_name}
                                                    })}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    {/* Row for inputting event logo */}
                                    <Row>
                                        <Col md="6" sm="6" xs="12">
                                            <FormGroup className="withLabel">
                                                <label className="control-label col-md-4">Event Logo:</label>
                                                <div className="col-md-8 event-logo">
                                                    {
                                                        this.state.event.logo ? (
                                                            <img id="logo" src={config.backendUrl + this.state.event.logo} ref={(ref) => this.logoImageRef = ref} alt=""/>
                                                        ) : (
                                                            <div className="empty-logo"></div>
                                                        )
                                                    }
                                                    <div className="btn_edit" align="center" onClick={() => this.onSelectUploadfile()}>
                                                        <Button type="button" color="primary">Select Image</Button>
                                                        <input accept="image/*" ref={(ref) => this.logoFileInput = ref} type="file" className="logo-file" id="input-file" name="logo" onChange={() => this.onAvatarChange()}/>
                                                    </div>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" sm="6" xs="12">
                                            <FormGroup className="withLabel no-margin">
                                                <label className="control-label col-md-4">Event Date:</label>
                                                <div className="col-md-8">
                                                    <DatePicker selected={this.state.event.start} dateFormat="MM/dd/yyyy" onChange={(val) => this.eventState('start', val)} />
                                                    <span> ~ </span>
                                                    <DatePicker selected={this.state.event.end} dateFormat="MM/dd/yyyy" onChange={(val) => this.eventState("end", val)} />
                                                </div>
                                            </FormGroup>
                                            <YesNo name="capture_type" setValue={this.eventState.bind(this)} value={this.state.event.capture_type} val1="jpeg" val2="gif" lab_title="Event Capture Type: "/>
                                            <YesNo name="camera_type" setValue={this.eventState.bind(this)} value={this.state.event.camera_type} val1="front" val2="back" lab_title="Front or Back Camera: "/>
                                        </Col>
                                    </Row>

                                    {/* Row for inputting event customization */}
                                    <Row>
                                        <Col xs="12" sm="12" md="12">
                                            <Card>
                                                <CardHeader>Event Customization
                                                    <div className="card-header-actions">
                                                        <a className="card-header-action btn btn-minimize" data-target="#ec_collapse" onClick={() => this.toggle('ec_collapse')}><i className="icon-arrow-up"></i></a>
                                                    </div>
                                                </CardHeader>
                                                <Collapse isOpen={this.state.ec_collapse} id="ec_collapse">
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6" md="6">
                                                                <span>Fields to Capture</span>
                                                                <div className="content">
                                                                    <YesNo name="cf_first_name" setValue={this.eventState.bind(this)} value={this.state.event.cf_first_name} val1="yes" val2="no" lab_title="First Name: "/>
                                                                    <YesNo name="cf_last_name" setValue={this.eventState.bind(this)} value={this.state.event.cf_last_name} val1="yes" val2="no" lab_title="Surname: "/>
                                                                    <YesNo name="cf_instagram_handle" setValue={this.eventState.bind(this)} value={this.state.event.cf_instagram_handle} val1="yes" val2="no" lab_title="Instagram Handle: "/>
                                                                    <YesNo name="cf_email" setValue={this.eventState.bind(this)} value={this.state.event.cf_email} val1="yes" val2="no" lab_title="E-Mail: "/>
                                                                    <YesNo name="cf_telephone" setValue={this.eventState.bind(this)} value={this.state.event.cf_telephone} val1="yes" val2="no" lab_title="Telephone #: "/>
                                                                    <FormGroup className="withLabel">
                                                                        <label className="control-label col-md-4">How many prints: </label>
                                                                        <div className="col-md-4">
                                                                            <Input type="number" id="cf_print_num" name="cf_print_num" value={this.state.event.cf_print_num} onChange={(e) => this.eventState("cf_print_num", e.target.value)} />
                                                                        </div>
                                                                    </FormGroup>
                                                                </div>
                                                            </Col>
                                                            <Col xs="12" sm="6" md="6">
                                                                <span>Output Options</span>
                                                                <div className="content">
                                                                    <YesNo name="oo_email" setValue={this.eventState.bind(this)} value={this.state.event.oo_email} val1="yes" val2="no" lab_title="E-Mail: "/>
                                                                    <YesNo name="oo_sms" setValue={this.eventState.bind(this)} value={this.state.event.oo_sms} val1="yes" val2="no" lab_title="SMS: "/>
                                                                    <YesNo name="oo_print" setValue={this.eventState.bind(this)} value={this.state.event.oo_print} val1="yes" val2="no" lab_title="Print: "/>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Collapse>
                                            </Card>
                                        </Col>
                                    </Row>

                                    {/* Row for inputting event photo frames */}
                                    <Row>
                                        <Col xs="12" sm="12" md="12">
                                            <Card>
                                                <CardHeader>Photo Frames
                                                    <div className="card-header-actions">
                                                        <a className="card-header-action btn btn-minimize" data-target="#ec_collapse" onClick={() => this.toggle('pf_collapse')}><i className="icon-arrow-up"></i></a>
                                                    </div>
                                                </CardHeader>
                                                <Collapse isOpen={this.state.pf_collapse} id="ec_collapse">
                                                    <CardBody>
                                                        <Row>
                                                            <Col md="3" sm="6" xs="12" align="center">
                                                                <ImageSelector name="photoframe1" img={this.state.event.photoframe1} setValue={this.eventState.bind(this)}/>
                                                            </Col>

                                                            <Col md="3" sm="6" xs="12" align="center">
                                                                <ImageSelector name="photoframe2" img={this.state.event.photoframe2} setValue={this.eventState.bind(this)}/>
                                                            </Col>

                                                            <Col md="3" sm="6" xs="12" align="center">
                                                                <ImageSelector name="photoframe3" img={this.state.event.photoframe3} setValue={this.eventState.bind(this)}/>
                                                            </Col>

                                                            <Col md="3" sm="6" xs="12" align="center">
                                                                <ImageSelector name="photoframe4" img={this.state.event.photoframe4} setValue={this.eventState.bind(this)}/>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Collapse>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row>
                                        {/* Row for managin event email & sms */}
                                        <Col xs="12" sm="6" md="6">
                                            <Card>
                                                <CardHeader>E-Mail/SMS Copy
                                                <div className="card-header-actions">
                                                    <a className="card-header-action btn btn-minimize" data-target="#ec_collapse" onClick={() => this.toggle('es_collapse')}><i className="icon-arrow-up"></i></a>
                                                </div>
                                                </CardHeader>
                                                <Collapse isOpen={this.state.es_collapse} id="ec_collapse">
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12">
                                                                <span className="subtitle">E-Mail Copy</span>
                                                                <Row>
                                                                    <Col xs='12'>
                                                                        <FormGroup className="withLabel">
                                                                            <label className="control-label col-md-4">E-Mail Subject:</label>
                                                                            <div className="col-md-8">
                                                                                <Input type="email" id="email_subject" name="email_subject" value={this.state.event.email_subject}
                                                                                    onChange={(e) => this.eventState("email_subject", e.target.value)} />
                                                                            </div>
                                                                        </FormGroup>
                                                                        <FormGroup className="withLabel">
                                                                            <label className="control-label col-md-4">E-Mail Body Copy:</label>
                                                                            <div className="col-md-8">
                                                                                <Input type="textarea" name="email_body" id="email_body" rows="5" placeholder="" value={this.state.event.email_body_copy}
                                                                                    onChange={(e) => this.eventState("email_body_copy", e.target.value)} />
                                                                            </div>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            <Col xs="12">
                                                                <span className="subtitle">E-Mail Copy</span>
                                                                <Row>
                                                                    <Col xs='12'>
                                                                        <FormGroup className="withLabel">
                                                                            <label className="control-label col-md-4">SMS Message:</label>
                                                                            <div className="col-md-8">
                                                                                <Input type="textarea" name="sms_msg" id="sms_msg" rows="5" placeholder="" value={this.state.event.sms_message}
                                                                                    onChange={(e) => this.eventState("sms_message", e.target.value)} />
                                                                            </div>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Collapse>
                                            </Card>
                                        </Col>

                                        {/* Row for managin event users */}
                                        <Col xs="12" sm="6" md="6">
                                            <Card>
                                                <CardHeader>Event Manager Accounts
                                                <div className="card-header-actions">
                                                    <a className="card-header-action btn btn-minimize" data-target="#ec_collapse" onClick={() => this.toggle('ema_collapse')}><i className="icon-arrow-up"></i></a>
                                                </div>
                                                </CardHeader>
                                                <Collapse isOpen={this.state.ema_collapse} id="ec_collapse">
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12">
                                                                <Table responsive>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>No</th>
                                                                            <th>Email</th>
                                                                            <th>Password</th>
                                                                            <th></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            this.state.userlist && this.state.userlist.map((user, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{index + 1}</td>
                                                                                    <td>{user.email}</td>
                                                                                    <td>{user.password}</td>
                                                                                    <td>
                                                                                        <i className="fa fa-trash-o control" onClick={() => this.deleteUser(user.id)}></i>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        }
                                                                        
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td>
                                                                                <Input type='email' id="new_email" name="new_email" ref={(ref) => this.emailRef = ref} value={this.state.email}
                                                                                    onChange={(e) => this.setState({email: e.target.value})} disabled={this.state.event.id === '' ? true : false} />
                                                                            </td>
                                                                            <td>
                                                                                <Input type='password' id="new_passwd" name="new_passwd"  ref={(ref) => this.passwordRef = ref} value={this.state.password}
                                                                                    onChange={(e) => this.setState({password: e.target.value})} disabled={this.state.event.id === '' ? true : false} />
                                                                            </td>
                                                                            <td>
                                                                                <Button color="primary" type="button" onClick={() => this.addUser()}
                                                                                    disabled={this.state.event.id === '' ? true : false}>
                                                                                    <i className="fa fa-plus"></i>
                                                                                </Button>
                                                                            </td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </Table>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Collapse>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <ToastContainer />
            </div>
        )
    }
}

export default EditEvent