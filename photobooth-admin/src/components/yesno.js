import React, { Component } from 'react'
import { FormGroup, Input, Label } from 'reactstrap';

class YesNo extends Component {

    jsUcfirst = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    connectState(val){
        this.props.setValue(this.props.name, val)
    }

    render() {
        return (
            <FormGroup className="withLabel no-margin">
                <label className="control-label col-md-4">{this.props.lab_title}</label>
                <div className="col-md-8">
                    <FormGroup check inline>
                        <Input 
                            id={this.props.name + "Y"}
                            className="form-check-input" 
                            type="radio"
                            name={this.props.name} 
                            value={this.props.val1} 
                            checked={this.props.value === this.props.val1 ? true : false}
                            onClick={() => this.connectState(this.props.val1)}
                            readOnly />
                        <Label className="form-check-label" check htmlFor={this.props.name + "Y"}>{this.jsUcfirst(this.props.val1)}</Label>
                    </FormGroup>
                    <FormGroup check inline>
                        <Input 
                            className="form-check-input" 
                            type="radio" 
                            id={this.props.name + "N"} 
                            name={this.props.name} 
                            value={this.props.val2} 
                            checked={this.props.value === this.props.val2 ? true : false}
                            onClick={() => this.connectState(this.props.val2)}
                            readOnly />
                        <Label className="form-check-label" check htmlFor={this.props.name + "N"}>{this.jsUcfirst(this.props.val2)}</Label>
                    </FormGroup>
                </div>
            </FormGroup>
        )
    }
}

export default YesNo