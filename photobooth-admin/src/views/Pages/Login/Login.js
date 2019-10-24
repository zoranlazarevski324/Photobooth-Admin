import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert } from 'reactstrap';
import login_logo from '../../../assets/img/ic_login_logo.png';
import * as EmailValidator from 'email-validator';
import Loading from '../../../components/loading'
import axios from 'axios'
import config from '../../../config'

class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            signed: false
        }
    }

    componentDidMount() {
        const login_user = JSON.parse(window.localStorage.getItem('login_user'))
        if(login_user){
            this.setState({loading: false, signed: true})
        } else {
            this.setState({loading: false, signed: false})
        }
    }

    async login() {
        let email = document.getElementById('email').value;
        let passwd = document.getElementById('password').value;
        document.getElementById('reset-password-panel').classList.add('hide');

        if (email === ''){
            ReactDOM.findDOMNode(this.refs.emailInput).focus();
            document.getElementById('invalid-panel').innerHTML='Please insert your email.';
            document.getElementById('invalid-panel').classList.remove('hide');
            return ;
        } else if(!EmailValidator.validate(email)){
            document.getElementById('email').value = '';
            ReactDOM.findDOMNode(this.refs.emailInput).focus();
            document.getElementById('invalid-panel').innerHTML='Invalid email.';
            document.getElementById('invalid-panel').classList.remove('hide');
            return ;
        }

        if (passwd === ''){
            ReactDOM.findDOMNode(this.refs.passwordInput).focus();
            document.getElementById('invalid-panel').innerHTML='Please insert your password.';
            document.getElementById('invalid-panel').classList.remove('hide');
            return ;
        }

        try {
            const res = await axios.post(config.backendUrl + 'signin', {
                email: email,
                password: passwd
            })

            if (res.data.success && res.data.login_user !== null) {
                window.localStorage.setItem('login_user', JSON.stringify(res.data.login_user));
                this.setState({loading: false, signed: true})
            } else if(res.data.login_user === null) {
                document.getElementById('invalid-panel').innerHTML = 'There is no such user.';
                document.getElementById('invalid-panel').classList.remove('hide');
            } else if(res.data.error) {
                document.getElementById('invalid-panel').innerHTML = res.data.error.errorMsg;
                document.getElementById('invalid-panel').classList.remove('hide');
            } else {
                document.getElementById('invalid-panel').innerHTML = 'no response';
                document.getElementById('invalid-panel').classList.remove('hide');
            }
        } catch (error) {
            document.getElementById('invalid-panel').innerHTML=error.toString();
            document.getElementById('invalid-panel').classList.remove('hide');
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <Loading />
            )
        }

        if (this.state.isError) {
            return (
                <div>{this.state.errorMsg}</div>
            )
        }

        if(this.state.signed) {
            const login_user = JSON.parse(window.localStorage.getItem('login_user'))
            if(login_user.roll === 1)
                return (
                    <Redirect to="/clients"/>
                )
            else 
                return (
                    <Redirect to="/events"/>
                )
        }

        return (
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg="4" md="6" sm="8" xs="10">
                        <CardGroup>
                            <Card className="p-4">
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col xs="12" align="center">
                                                <img src={login_logo} className="login-logo" alt="GiftGo login logo" />
                                            </Col>
                                        </Row>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fa fa-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="email" name="email" id="email" onKeyDown={(e) => {
                                                if(e.keyCode === 13 && ReactDOM.findDOMNode(this.refs.emailInput).value.trim() !== ''){
                                                    ReactDOM.findDOMNode(this.refs.passwordInput).focus();
                                                }
                                            }} placeholder="Enter your email address" ref="emailInput" />
                                        </InputGroup>
                                        <InputGroup className="mb-1">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fa fa-lock"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="password" name="password" id="password" onKeyDown={(e) => {
                                                if(e.keyCode === 13 && ReactDOM.findDOMNode(this.refs.passwordInput).value.trim() !== ''){
                                                    this.login()
                                                }
                                            }} placeholder="Enter Password" ref="passwordInput"/>
                                        </InputGroup>
                                        <Row>
                                            <Col xs="12" align="center" className="btn-login">
                                                <Button color="primary" className="px-4" onClick={this.login.bind(this)}>Login</Button>
                                            </Col>
                                        </Row>

                                        <Row className="login-alert">
                                            <Col xs="12" align="center">
                                            <Alert color="success" id="reset-password-panel" className="hide">Email sent. Check it to reset password.</Alert>
                                            <Alert color="danger" id="invalid-panel" className="hide"></Alert>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </CardGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Login;
