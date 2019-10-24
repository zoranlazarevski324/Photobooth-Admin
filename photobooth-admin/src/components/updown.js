import React, { Component } from 'react'

class UpDown extends Component {

    render () {

        return (
            <div className="t-header">
                <div className="th-title">{this.props.title}</div>
                <div className="sort-direction">
                {
                    this.props.field === this.props.activeField ? (
                        <div className="up-down">
                            <i className={this.props.direct === 'asc' ? "fa fa-caret-up active" : "fa fa-caret-up"}></i>
                            <i className={this.props.direct === 'desc' ? "fa fa-caret-down active" : "fa fa-caret-down"}></i>
                        </div>
                    ) : (
                        <div className="up-down">
                            <i className="fa fa-caret-up"></i>
                            <i className="fa fa-caret-down"></i>
                        </div>
                    )
                }
                </div>
            </div>
        )
    }
}

export default UpDown