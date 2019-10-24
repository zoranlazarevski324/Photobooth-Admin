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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpDown from '../../components/updown'
import Loading from '../../components/loading'
import { Redirect, Link } from 'react-router-dom'
import config from '../../config'
import { saveAs } from 'file-saver';

class Events extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            signed: false,
            goEdit: false,
            search: '',
            pagesize: 5,
            pageno: 1,
            events: [],
            total: 0,
            sortfield: 'name',
            sortdirection: 'asc'
        }
    }

    componentDidMount() {

        const login_user = JSON.parse(window.localStorage.getItem('login_user'))
        if (login_user) {
            this.setState({loading: false, signed: true})
        } else {
            this.setState({loading: false, signed: false})
        }
        this.reloadData({})
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
        const login_user = JSON.parse(window.localStorage.getItem('login_user'))
        const pagesize = conf.pagesize || this.state.pagesize
        const pageno = conf.pageno || this.state.pageno
        const search = conf.search === undefined ? this.state.search : conf.search
        const sortfield = conf.sortfield || this.state.sortfield
        const sortdirection = conf.sortdirection || this.state.sortdirection

        try {
            const res = await axios.post(config.backendUrl + 'event/list', {
                search: search,
                sortField: sortfield,
                sortDirection: sortdirection,
                limit: parseInt(pagesize),
                offset: (pageno - 1) * pagesize,
                roll: login_user.roll,
                client_id: login_user.id
            })
            if (res.data.success){
                this.setState({pagesize, pageno, search, sortfield, sortdirection, total: res.data.result.pagination.totalCount, events: res.data.result.rows})
            }
        } catch (error) {
            console.log(error)
        }
    }

    changePageSize (e){
        this.reloadData({pagesize: parseInt(e.target.value)})
    }

    onDeleteEvent = async(id) => {
        if(window.confirm('Are you sure?')){
            const res = await axios.get(config.backendUrl + 'event/delete?id=' + id)
             if(res.data.success){
                toast.success('Event Deleting is done successfully.', {
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

    onExportEvent = async (id) => {
        try {
            const response = await axios({
                url: config.backendUrl + 'event/export?id=' + id,
                method: 'get',
                responseType: 'blob'
            })
            let filename = 'event' + id + '.xlsx';
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

    onExportEventImage = async (id) => {
        try {
            const response = await axios({
                url: config.backendUrl + 'event/export-image?id=' + id,
                method: 'get',
                responseType: 'blob'
            })
            let filename = 'eventimage' + id + '.zip';
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

    getOutput(event) {
        let res = ''
        if(event.oo_sms === 'yes')
        {
            res += res === '' ? 'SMS' : '/SMS'
        }

        if(event.oo_email === 'yes')
        {
            res += res === '' ? 'E-mail' : '/E-mail'
        }

        if(event.oo_print === 'yes')
        {
            res += res === '' ? 'Print' : '/Print'
        }
        return res
    }

    getDateRange(event) {
        const start = new Date(event.start)
        const end = new Date(event.end)

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const startStr = `${start.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`
        const endStr = `${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`
        return startStr + ' ~ ' + endStr
    }

    onDeleteEvent = async (id) => {
        if(window.confirm('Are you sure?')){
           const res = await axios.get(config.backendUrl + "event/delete?id=" + id)
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

    renderEventStatus(event){
        const cur = new Date()
        if(event.start > cur)   return "Upcoming"
        if(event.end < cur)     return "Completed"
        return ""
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

        if (this.state.goEdit) {
            return (
                <Redirect to="/eventedit" />
            )
        }

        const { events } = this.state

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
                                            <Button type="button" color="primary" onClick={() => this.setState({goEdit: true})}><i className="fa fa-plus"></i> Add Event</Button>
                                        </div>
                                    </div>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th onClick={() => this.sortAction('name')}>
                                                    <UpDown field="name" title="Event" activeField={this.state.sortfield} direct={this.state.sortdirection} />
                                                </th>
                                                <th>Event Logo</th>
                                                <th>Output</th>
                                                <th onClick={() => this.sortAction('daterange')}>
                                                    <UpDown field="daterange" title="Date Range" activeField={this.state.sortfield} direct={this.state.sortdirection} />
                                                </th>
                                                <th onClick={() => this.sortAction('client')}>
                                                    <UpDown field="client" title="Client" activeField={this.state.sortfield} direct={this.state.sortdirection} />
                                                </th>
                                                <th>Action</th>
                                                <th>Event Status</th>
                                                <th>Event Exports</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                events ? events.map(event => (
                                                    <tr key={event.id}>
                                                        <td>{event.name}</td>
                                                        <td className='company-logo'>
                                                            {
                                                                event.logo ? (
                                                                    <img src={config.backendUrl + event.logo} alt="" />
                                                                ) : (
                                                                    <div className="empty-logo"></div>
                                                                )
                                                            }
                                                        </td>
                                                        <td>{this.getOutput(event)}</td>
                                                        <td>{this.getDateRange(event)}</td>
                                                        <td>{event.User.full_name}</td>
                                                        <td>
                                                            <Link to={"/eventedit/" + event.id}><i className="fa fa-edit control"></i></Link>&nbsp;&nbsp;
                                                            <i className="fa fa-archive control" onClick={() => this.onDeleteEvent(event.id)}></i>&nbsp;&nbsp;
                                                            <Link to={"/eventcloneedit/" + event.id}><i className="fa fa-copy control"></i></Link>
                                                        </td>
                                                        <td>{this.renderEventStatus(event)}</td>
                                                        <td>
                                                            <i className="icon-share-alt icons control" onClick={() => this.onExportEvent(event.id)}></i>&nbsp;&nbsp;
                                                            <i className="fa fa-file-zip-o control" onClick={() => this.onExportEventImage(event.id)}></i>
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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <ToastContainer />
            </div>
        )
    }
}

export default Events