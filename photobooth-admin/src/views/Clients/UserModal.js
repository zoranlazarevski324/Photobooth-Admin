import React, { Component } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Form, FormGroup, Input
} from 'reactstrap';
import axios from 'axios';
import config from '../../config'

class UserModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            email: '',
            password: '',
            cpassword: '',
            company_name: '',
            contact_first_name: '',
            contact_last_name: '',
            contact_phone: '',
            logo: ''
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(next) {
        this.setState({
            id: next.user.id || '',
            email: next.user.email || '',
            password: next.user.password || '',
            company_name: next.user.company_name || '',
            contact_first_name: next.user.contact_first_name || '',
            contact_last_name: next.user.contact_last_name || '',
            contact_phone: next.user.contact_phone || '',
            logo: next.user.logo || ''
        })
    }

    onSelectUploadfile = () => {
        var infile = document.getElementById("input-file");
        infile.click();
    }

    onAvatarChange = () => {
        var infile = document.getElementById("input-file");
        if (infile.files && infile.files[0]) {
            var reader = new FileReader();
        
            this.setState({logo: 1})
            reader.onload = function(e) {
                document.getElementById("logo").src = e.target.result;
            }

            reader.readAsDataURL(infile.files[0]);
        }
    }

    saveClient = async () => {
        let form = new FormData()
        const { 
            toggle,
            loadData
        } = this.props

        if(this.state.id === '' && document.getElementById('input-file').value === ''){
            alert('Please select company logo');
            return ;
        }

        if (this.state.company_name === ''){
            alert('Please input company name');
            return ;
        }

        if (this.state.contact_first_name === ''){
            alert('Please input contact first name');
            return ;
        }

        if (this.state.contact_last_name === ''){
            alert('Please input contact last name');
            return ;
        }

        if (this.state.email === ''){
            alert('Please input contact email');
            return ;
        }

        if (this.state.password === ''){
            alert('Please input password');
            return ;
        }

        if (this.state.cpassword === ''){
            alert('Please confirm password again');
            return ;
        }

        form.append('company_name', this.state.company_name)
        form.append('contact_first_name', this.state.contact_first_name)
        form.append('contact_last_name', this.state.contact_last_name)
        form.append('email', this.state.email)
        form.append('contact_phone', this.state.contact_phone)
        form.append('password', this.state.password)
        form.append('id', this.state.id)
        if(document.getElementById('input-file').value !== '')
            form.append('logo', document.getElementById('input-file').files[0])

        await axios.post(config.backendUrl + "user/edit", form)
        setTimeout(() => {
            loadData({})
        }, 500)
        toggle()
    }

    handleInputChange = (e, value) => {
        this.setState({ [value]: e.target.value });
    };

    render() {
        const { modal, toggle } = this.props
        const closeBtn = <button type="submit" className="close" onClick={toggle}>&times;</button>;

        return (
            <Modal
                isOpen={modal}
                toggle={toggle}
                fade={false}
                className="edit-user-modal"
                size="xs">

                <ModalHeader close={closeBtn}>User</ModalHeader>
                <ModalBody className="create-user-modal">
                    <Form onSubmit={() => this.saveClient()}>
                        <FormGroup>
                            <Label for="company_name">Company Logo: </Label>
                            <div className="company-logo" align="center">
                                {
                                    this.state.logo === '' ? (
                                        <div className="empty-logo"></div>
                                    ) : (
                                        <img id="logo" src={config.backendUrl + this.state.logo} alt=""/>
                                    )
                                }
                                <div className="btn_edit" align="center" onClick={() => this.onSelectUploadfile()}>
                                    <Button type="button" color="primary">Select Image</Button>
                                    <input accept="image/*" type="file" className="logo-file" id="input-file" name="logo" onChange={() => this.onAvatarChange()}/>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Label for="company_name">Company Name: </Label>
                            <Input type="text" value={this.state.company_name} name="company_name" id="company_name" placeholder="Company Name" onChange={e => this.handleInputChange(e, 'company_name')}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="contact_name">Admin First Name: </Label>
                            <Input type="text" value={this.state.contact_first_name} name="contact_first_name" id="contact_first_name" placeholder="Contact Name" onChange={e => this.handleInputChange(e, 'contact_first_name')}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="contact_name">Admin Surname: </Label>
                            <Input type="text" value={this.state.contact_last_name} name="contact_last_name" id="contact_last_name" placeholder="Contact Name" onChange={e => this.handleInputChange(e, 'contact_last_name')}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Admin Email: </Label>
                            <Input type="email" value={this.state.email} name="email" id="email" placeholder="Contact Email" onChange={e => this.handleInputChange(e, 'email')}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="contact_phone">Admin Tel No: </Label>
                            <Input type="text" value={this.state.contact_phone} name="contact_phone" id="contact_phone" placeholder="Contact Phone" onChange={e => this.handleInputChange(e, 'contact_phone')}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Admin Password: </Label>
                            <Input type="password" name="password" id="password" placeholder="Password" onChange={e => this.handleInputChange(e, 'password')}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Confirm Password: </Label>
                            <Input type="password" name="cpassword" id="cpassword" placeholder="Confirm Password" onChange={e => this.handleInputChange(e, 'cpassword')}/>
                        </FormGroup>
                        <Input type="hidden" name="id" id="userid" value={this.state.id} />
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="success"
                        type="button" onClick={() => this.saveClient()}> Save</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default UserModal