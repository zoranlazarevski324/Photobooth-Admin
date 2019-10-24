import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'

class AdminHeader extends Component {
    constructor(){
        super()
        this.state = {
            signed: true
        }
    }

    componentDidMount() {

    }

    signout = () => {
        const {
            signoutFunc
        } = this.props
        window.localStorage.removeItem('login_user')
        signoutFunc()
    }

    render() {
        return (
            <div className="header-container">
                <div className="nav-container">
                    {
                        this.props.activeBtn === 'clients' ? (
                            <div className='active-pBtn'>Clients</div>
                        ) : (
                            <Link to="/user"><div className='pBtn'>Clients</div></Link>
                        )
                    }
                    {
                        this.props.activeBtn === 'events' ? (
                            <div className='active-pBtn'>Events</div>
                        ) : (
                            <Link to="/event"><div className='pBtn'>Events</div></Link>
                        )
                    }
                </div>
                <div className="signout">
                    <span><i className="fa fa-sign-out signout" onClick={() => this.signout()}></i></span>
                </div>
            </div>
        )
    }
}

export default AdminHeader