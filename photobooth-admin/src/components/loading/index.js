import React, { Component } from 'react'
import loadingIcon from '../../assets/images/spinner.png'
import './styles.scss'

class Loading extends Component {
    render() {
        return (
            <div className="loading-container">
                <div><img src={loadingIcon} alt="loading spinner" /></div>
                <span>Loading...</span>
            </div>
        )
    }
}

export default Loading