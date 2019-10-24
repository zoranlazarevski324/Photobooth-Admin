import React, { Component } from 'react'
import { 
    Card, 
    CardBody,
    Button, 
    Col,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    Table,
} from 'reactstrap';
import axios from 'axios'
import UserModal from './UserModal'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Switch from "react-switch";
import UpDown from '../../components/updown'
import Loading from '../../components/loading'
import { Redirect } from 'react-router-dom'
import config from '../../config'
import { saveAs } from 'file-saver';

class Clients extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            signed: false,
            search: '',
            pagesize: 5,
            pageno: 1,
            clients: [],
            total: 0,
            sortfield: 'company_name',
            sortdirection: 'asc',
            modal: false,
            user: {}
        }
    }

    componentDidMount() {

        const login_user = JSON.parse(window.localStorage.getItem('login_user'))

        if(login_user === null){
            this.setState({loading: false, signed: false})
            return ;
        }

        if (login_user.roll === 0) {
            window.localStorage.removeItem('login_user')
            this.setState({loading: false, signed: false})
            return 
        }
        if(login_user){
            this.setState({loading: false, signed: true, login_user})
            this.reloadData({})
        } else {
            this.setState({loading: false, signed: false})
            return 
        }
    }

    modalToggle = () => {
        const { modal } = this.state;
        this.setState({
          modal: !modal,
        });
    }

    setPage(no){
        this.reloadData({pageno: no})
    }

    prevPage(){
        const {pageno} = this.state
        this.reloadData({pageno: pageno === 1 ? 1 : (pageno - 1)})
    }

    afterPage() {
        let totalPages = this.state.total % this.state.pagesize === 0 ? this.state.total / this.state.pagesize : Math.floor(this.state.total / this.state.pagesize) + 1 
        const {pageno} = this.state
        this.reloadData({pageno: pageno === totalPages ? totalPages : (pageno + 1)})
    }

    reloadData = async (conf) => {
        const pagesize = conf.pagesize || this.state.pagesize
        const pageno = conf.pageno || this.state.pageno
        const search = conf.search === undefined ? this.state.search : conf.search
        const sortfield = conf.sortfield || this.state.sortfield
        const sortdirection = conf.sortdirection || this.state.sortdirection

        try {
            const res = await axios.post(config.backendUrl + 'user/list', {
                search: search,
                sortField: sortfield,
                sortDirection: sortdirection,
                limit: parseInt(pagesize),
                offset: (pageno - 1) * pagesize,
            })
            if (res.data.success){
                this.setState({pagesize, pageno, search, sortfield, sortdirection, total: res.data.result.pagination.totalCount, clients: res.data.result.rows})
            }
        } catch (error){
            console.log(error)
        }
    }

    changePageSize (e){
        this.reloadData({pagesize: parseInt(e.target.value)})
    }

    onAddClient = () => {
        this.setState({modal: true, user: {}})
    }

    onEditClient = async (id) => {
        const res = await axios.get(config.backendUrl + "user/select?id=" + id)
        if(res.data.success)
            this.setState({modal: true, user: res.data.result})
    }

    onDeleteClient = async (id) => {
        if(window.confirm('Are you sure?')){
           const res = await axios.get(config.backendUrl + "user/delete?id=" + id)
            if(res.data.success){
                toast.success('Client Deleting is done successfully.', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    draggable: false
                })
                this.reloadData({})
            }
        }
    }

    async onExport() {
        try {
            const response = await axios({
                url: config.backendUrl + 'user/export',
                method: 'get',
                responseType: 'blob'
            })
            let filename = 'clientdata.xlsx';
            saveAs(response.data, filename);
        } catch(error){
            toast.error(error.toString(), {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: false
            })
        }
    }

    changeActiveState = async (id, state) => {
        const res = await axios.post(config.backendUrl + "user/active", { id, state })
        if(res.data.success && res.data.state === state){
            this.reloadData({})
            if(state)
                toast.success('Selected Client is activated successfully.', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    draggable: false
                })
            else 
                toast.success('Selected Client is deactivated successfully.', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    draggable: false
                })
        }
    }

    sortAction = (field) => {
        var sortDirection = ''
        var sortField = field

        if (field === this.state.sortfield){
            sortDirection = this.state.sortdirection === 'desc' ? 'asc' : 'desc'
        } else {
            sortDirection = 'asc'
        }
        
        this.reloadData({sortdirection: sortDirection, sortfield: sortField})
    }

    renderDate(date) {
        const d = date.substring(0, 10)
        var t = d.split(/[-]/);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return (t[2] + ' ' + months[parseInt(t[1]) - 1] + ', ' + t[0])
    }

    renderPagination = () => {
        var firstPage = (this.state.pageno - 2) <= 0 ? 1 : (this.state.pageno - 2)
        var lastPage = firstPage + 4
        let totalPages = this.state.total % this.state.pagesize === 0 ? this.state.total / this.state.pagesize : Math.floor(this.state.total / this.state.pagesize) + 1 

        if(totalPages < lastPage)
            lastPage = totalPages

        const tmpArray = Array.from(Array(lastPage - firstPage + 1), (x, index) => index + firstPage)

        return (
            <nav aria-label="pagination">
                <ul className="pagination">
                {
                    this.state.pageno === 1 ? (
                        <li className="page-item">
                            <button className="pagination-btn" aria-label="Previous" type="button">
                                <span aria-hidden="true">«</span>
                            </button>
                        </li>
                    ) : (
                        <li className="page-item">
                            <button className="pagination-btn" aria-label="Previous" type="button" onClick={() => this.prevPage()}>
                                <span aria-hidden="true">«</span>
                            </button>
                        </li>
                    )
                }
                
                {
                    tmpArray.map((item, index) => {
                        if(item === this.state.pageno)
                            return (
                                <li className="page-item active" key={index}>
                                    <button className="pagination-btn" type="button">{item}</button>
                                </li>
                            )

                        return (
                            <li className="page-item" key={index}>
                                <button className="pagination-btn" type="button" onClick={() => this.setPage(item)}>{item}</button>
                            </li>
                        )
                    })
                }
				
                {
                    this.state.pageno === totalPages ? (
                        <li className="page-item">
                            <button className="pagination-btn" type="button" aria-label="Next">
                                <span aria-hidden="true">»</span>
                            </button>
                        </li>
                    ) : (
                        <li className="page-item">
                            <button className="pagination-btn" type="button" aria-label="Next" onClick={() => this.afterPage()}>
                                <span aria-hidden="true">»</span>
                            </button>
                        </li>
                    )
                }
                </ul>
            </nav>
        )
    }

    render () {
        if (this.state.loading) {
            return (
                <Loading />
            )
        } 
        
        if (!this.state.signed) {
            return (
                <Redirect to="/login" />
            )
        }

        const { clients } = this.state

        return (
            <div className="client-container">
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>
                                <div method="post" className="form-horizontal">
                                    <div className="row">
                                        <div className="col-md-4 col-sm-4 col-xs-12">
                                            <FormGroup className="pagesize">
                                                <span>Elements on Page:&nbsp;</span>
                                                <select className="form-control" onChange={(e) => this.reloadData({pagesize: e.target.value, pageno: 1})}>
                                                    <option value="5">5</option>
                                                    <option value="10">10</option>
                                                    <option value="25">25</option>
                                                    <option value="50">50</option>
                                                </select>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup row>
                                                <Col md="12">
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="fa fa-search"></i>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input type="text" id="search" name="search" placeholder="Search" onKeyDown={(e) => {
                                                            if(e.keyCode === 13){
                                                                this.reloadData({search: document.getElementById('search').value})
                                                            }
                                                        }} />
                                                    </InputGroup>
                                                </Col>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4" align="right">
                                            <Button type="button" color="primary" onClick={()=>this.onAddClient()}><i className="fa fa-plus"></i> Add Client</Button>&nbsp;&nbsp;
                                            <Button type="button" color="success" onClick={()=>this.onExport()}><i className="icon-share-alt icons"></i> Export</Button>
                                        </div>
                                    </div>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th onClick={() => this.sortAction('company_name')}>
                                                    <UpDown field="company_name" title="Client" activeField={this.state.sortfield} direct={this.state.sortdirection} />
                                                </th>
                                                <th>Logo</th>
                                                <th onClick={() => this.sortAction('createdAt')}>
                                                    <UpDown field="createdAt" title="Date Added" activeField={this.state.sortfield} direct={this.state.sortdirection} />
                                                </th>
                                                <th onClick={() => this.sortAction('active')}>
                                                    <UpDown field="active" title="Active" activeField={this.state.sortfield} direct={this.state.sortdirection} />
                                                </th>
                                                <th onClick={() => this.sortAction('email')}>
                                                    <UpDown field="email" title="Email" activeField={this.state.sortfield} direct={this.state.sortdirection} />
                                                </th>
                                                <th>Controls</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                clients ? clients.map(user => (
                                                    <tr key={user.id}>
                                                        <td>{user.company_name}</td>
                                                        <td className='company-logo'>
                                                            {
                                                                user.logo ? (
                                                                    <img src={config.backendUrl + user.logo} alt="" />
                                                                ) : (
                                                                    <div className="empty-logo"></div>
                                                                )
                                                            }
                                                        </td>
                                                        <td>{this.renderDate(user.createdAt)}</td>
                                                        <td>
                                                            <Switch 
                                                                onChange={(state) => this.changeActiveState(user.id, state)} checked={user.active === 1 ? true : false} 
                                                                disabled={user.roll === 1 ? true : false}/>
                                                        </td>
                                                        <td>{user.email}</td>
                                                        <td>
                                                            <i className="fa fa-edit control" onClick={() => this.onEditClient(user.id)}></i>&nbsp;&nbsp;
                                                            {
                                                                user.roll === 0 && (
                                                                    <i className="fa fa-archive control" onClick={() => this.onDeleteClient(user.id)}></i>
                                                                )
                                                            }
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr><td colspan='6'>No Result</td></tr>
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                    {this.renderPagination()}
                                </div>
                                <UserModal
                                    modal={this.state.modal}
                                    toggle={this.modalToggle}
                                    loadData={this.reloadData}
                                    user={this.state.user} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <ToastContainer />
            </div>
        )
    }
}

export default Clients