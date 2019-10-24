import React, { Component } from 'react'
import noImg from '../assets/images/no-image.png'
import config from '../config'

class ImageSelector extends Component {

    constructor() {
        super()
        this.state = {
            isSelected: false,
            image: null
        }
    }

    componentDidMount(){
        if(this.props.img){
           this.setState({isSelected: true})
        } else {
            this.setState({isSelected: false})
        }
    }

    onSelectUploadfile = () => {
        this.fileInput.click();
    }

    onAvatarChange = () => {
        var infile = this.fileInput
        if (infile.files && infile.files[0]) {
            var reader = new FileReader()
        
            this.setState({isSelected: true})
            this.props.setValue(this.props.name, infile.files[0])
            reader.onload = (e) => {
                this.imageRef.src = e.target.result;
            }

            reader.readAsDataURL(infile.files[0]);
        }
    }

    render() {
        return (
            <div className="image-selector">
                <img src={this.state.isSelected ? config.backendUrl + this.props.img : noImg} ref={(ref) => this.imageRef = ref} alt="" />
                <div className="edit" onClick={() => this.onSelectUploadfile()}>
                    <i className={this.state.isSelected ? "fa fa-edit" : "fa fa-plus"} ></i>
                    <input accept="image/*" type="file" ref={(ref) => this.fileInput = ref} className="logo-file" id="input-file" name="logo" onChange={() => this.onAvatarChange()}/>
                </div>
            </div>
        )
    }
}

export default ImageSelector