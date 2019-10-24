import React, { Component } from 'react'
import EditEvent from './EditEvent'

class CloneEditEvent extends Component {
    render () {
        return (<EditEvent clone="clone" id={this.props.match.params.id}/>)
    }
}

export default CloneEditEvent