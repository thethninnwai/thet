import React from 'react';
import Link from 'next/link'
import Head from 'next/head'
import {loadFirebase} from '../lib/db.js'
export default class Job extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.datatableRef = React.createRef();
        this.$datatable = null
        this.state = {
            edit_id : '',
            delete_id : '',
            JobName : '',
            JobEmail : '',
            JobPhone : '',
            JobAddress : '',
            JobStatus : '',
            MinSalary : '',
            MaxSalary : '',
            WorkingDays : '',
            WorkingHours : '',
            MinAge : '',
            JpSkill : '',
            JobDescription : '',
            Qualification : '',
            PostedDate : '',
            cities : props.city,
            area : '',
            city : '',
            jobs : props.job || [],
            areas : props.area || [],
            cities : props.city || []
        };
    }
    
    componentDidMount(){
        this.initializeDatable()
    }
    initializeDatable(){
        this.$datatable=$(this.datatableRef.current).DataTable({
            order: [[3, "desc"]],
        });
    }
    refreshTable = () =>{
        this.$datatable.clear()
        const self = this;
        Job
            .getInitialProps()
            .then((response)=>{
                this.setState({
                    jobs:response.job
                })
            }
        ).bind(this);
}

    static async getInitialProps() {

        const firebase = await loadFirebase() 
        const jobQuerySnapshot = await firebase
            .firestore()
            .collection("job")
            .get();
        const jobs = jobQuerySnapshot.docs.map((doc) =>({
            ...doc.data(),
            id: doc.id,
        }));
        const areaQuerySnapshot = await firebase
            .firestore()
            .collection("area")
            .get();
        const areas = areaQuerySnapshot.docs.map((doc)=>({
            ...doc.data(),
            id: doc.id,
        }));
        const cityQuerySnapshot = await firebase
            .firestore()
            .collection("city")
            .get();
        const cities = cityQuerySnapshot.docs.map((doc)=>({
            ...doc.data(),
            id: doc.id,
        }));
            return {job : jobs, area : areas, city : cities};
    }

    passDeleteId=(id)=>{
        this.setState({delete_id : id})
    };
    deleteJob=()=>{
        let firebase=loadFirebase()
        try{
            firebase.firestore().collection('job')
            .doc(this.state.delete_id)
            .delete();
            console.log("Delete successful");
            this.refreshTable();
        }catch(error){
            console.log(error)
        }
    };
    viewPassId=(id)=>{
        this.setState({edit_id : id})
        let firebase=loadFirebase()
        let data={}
        try {
            firebase.firestore().collection('job').doc(id).get().then((snapshot)=>{
                data=snapshot.data()
                console.log(data)
                this.setState({
                    JobName:data.JobName,
                    JobEmail:data.JobEmail,
                    JobPhone:data.JobPhone,
                    JobAddress:data.JobAddress,
                    area:data.area,
                    city:data.city,
                    JobStatus:data.JobStatus,
                    MinSalary:data.MinSalary,
                    MaxSalary:data.MaxSalary,
                    WorkingDays:data.WorkingDays,
                    WorkingHours:data.WorkingHours,
                    MinAge : data.MinAge,
                    JpSkill:data.JpSkill,
                    JobDescription:data.JobDescription,
                    Qualification:data.Qualification,
                    PostedDate:data.PostedDate,
                })
            })
            console.log("getting data")
        }catch(error){
            console.log(error)
        }
        console.log(this.state.JobName)
    };
    passEditId=(id)=>{
        this.setState({edit_id:id})
        let firebase=loadFirebase()
        let data={}
        try{
            firebase.firestore().collection('job').doc(id).get().then((snapshot)=>{
                data=snapshot.data()
                console.log()
                console.log(data)
                this.setState({
                    JobName:data.JobName,
                    JobEmail:data.JobEmail,
                    JobPhone:data.JobPhone,
                    JobAddress:data.JobAddress,
                    area:data.area,
                    cityName:data.cityName,
                    JobStatus:data.JobStatus,
                    MinSalary:data.MinSalary,
                    MaxSalary:data.MaxSalary,
                    WorkingDays:data.WorkingDays,
                    WorkingHours:data.WorkingHours,
                    MinAge:data.MinAge,
                    JpSkill:data.JpSkill,
                    area : data.area,
                    city : data.city,
                    JobDescription:data.JobDescription,
                    Qualification:data.Qualification,
                    PostedDate:data.PostedDate,
                })
                this.getArea(data.areaID)
            })
            }catch(error){
                console.log(error)
            }
        };
        updateJob=()=>{
            console.log("updating")
            console.log(this.state)
            let firebase=loadFirebase()
            try{
                firebase.firestore().collection('job').doc(this.state.edit_id).update({
                    JobName:this.state.JobName,
                    JobEmail:this.state.JobEmail,
                    JobPhone:this.state.JobPhone,
                    JobAddress:this.state.JobAddress,
                    JobStatus:this.state.JobStatus,
                    MinSalary:this.state.MinSalary,
                    MaxSalary:this.state.MaxSalary,
                    WorkingDays:this.state.WorkingDays,
                    WorkingHours:this.state.WorkingHours,
                    MinAge:this.state.MinAge,
                    JpSkill:this.state.JpSkill,
                    area : this.state.area,
                    city : this.state.city,
                    JobDescription:this.state.JobDescription,
                    Qualification:this.state.Qualification,
                    PostedDate:this.state.PostedDate,
                });
                console.log("update successful")
                this.refreshTable();
            }catch(error){
                console.log(error)
            }
        };
        handleChange=(event)=>{
            this.setState({[event.target.name]:event.target.value})
            if(event.target.name == "areaID"){}
        };
       
        EmpName = (id) => {
            const employer = this.props.employers
            let name = ''
            employer.map(employers=>{
                if(employer.id == id){
                    name = employer.name
                }
            })
            return name
        }
        getLocation = (cityID, areaID) => {
            const city = this.props.city
            const area = this.props.area
            let cityName = ''
            let areaName = ''
    
            city && city.map(City=>{
                if(City.id == cityID){
                    city = City.city
                }
            })
            area && area.map(Area=>{
                if(Area.id == areaID){
                    area = Area.area
                }
            })
           return city + "," + area
        }
        getArea = (id) => {
            const areas = this.props.area
            let areaName = ''
            areas.map(area => {
                if(area.id == id){
                    areaName = area.areaName
                }
            })
            return areaName
        }
        getCity = (id) => {
            const cities = this.props.city
            let cityName = ''
            cities.map(city => {
                if(city.id == id){
                    cityName = city.name
                }
            })
            return cityName
        }
        form_clear = (event) => {
            this.setState(this.initial_state);
            let inputs, index;
            inputs = document.getElementsByTagName('input');
            for (index = 0; index < inputs.length; ++index) {
                inputs[index].value = ''
            }
            document.getElementById('JobAddress').value = '';
            document.getElementById('JobDescription').value = '';
      
            $("#JobStatus option[selected]").removeAttr("selected");    
            $("#JobStatus option:first").attr("selected","selected");
            $("#JpSkill option[selected]").removeAttr("selected");    
            $("#JpSkill option:first").attr("selected","selected");
            $("#city option[selected]").removeAttr("selected");    
            $("#city option:first").attr("selected","selected"); 
            $("#area option[selected]").removeAttr("selected");    
            $("#area option:first").attr("selected","selected");   
        };
        disable = (event) => {   
            $("#JobStatus option:first").attr("disabled","disabled"); 
            $("#JpSkill option:first").attr("disabled","disabled"); 
            $("#city option:first").attr("disabled","disabled");
            $("#area option:first").attr("disabled","disabled"); 
        }
        getDateString = (dateobj) => {
            let t = new Date(1970,0,1)
            t.setSeconds(dateobj.seconds)
            let month = t.getMonth()+1
            return t.getDate()+"/"+ month +"/"+ t.getFullYear()
        }

    render(){
        const cities = this.state.cities
        const areas = this.state.areas
        return (
            <html>
                <Head>
                    <title>Golden Snitch | Admin</title>
                </Head>
                <body class="">
                <div class="modal fade" id="jobEditModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit Job</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                    <form action="#" method="post">
                        <div class="row">
                            <div class="col-md-5 pr-1">
                                <div class="form-group">
                                    <label>Name</label>
                                    <input type="text" class="form-control" name="JobName" onChange={this.handleChange} value={this.state.JobName} required/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 pr-1">
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Email</label>
                                    <input type="email" class="form-control" name="JobEmail" onChange={this.handleChange} value={this.state.JobEmail} required/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 pr-1">
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Phone</label>
                                        <input type="tel" class="form-control"  name="JobPhone" onChange={this.handleChange} value={this.state.JobPhone}required/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-10 pr-1">
                                <div class="form-group">
                                    <label>Address</label>
                                    <input type="text" class="form-control" name="JobAddress" onChange={this.handleChange} value={this.state.JobAddress} required/>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div class="row">
                            <div class="col-md-3 pr-1">
                                <div class="form-group">
                                    <label>Employment Status <br/>
                                        <select id="job_sts" name="JobStatus" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} value={this.state.selectedValue} required>
                                            <option value="none" label="--Select Employment Status--" selected disabled hidden></option>
                                            
                                            <option value="full time" selected={this.state.JobStatus == "full time" ? "selected" : ""}>Full Time</option>
                                            <option value="part time" selected={this.state.JobStatus == "part time" ? "selected" : ""}>Part Time</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div class="row">
                            <div class="col-md-12 pr-1">
                                <div class="form-group">
                                    <label>Salary</label>
                                </div>
                                <div>
                                    <a style={{fontSize: "small"}}>Minimum</a>&nbsp;
                                    <input type="number" min="100,000" name="MinSalary" onChange={this.handleChange} value={this.state.MinSalary} required/>
                                    &nbsp;&nbsp;
                                    <a style={{fontSize: "small"}}>Maximum</a>&nbsp;
                                    <input type="number" min="100,000" name="MaxSalary" onChange={this.handleChange} value={this.state.MaxSalary} required/>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div class="row">
                            <div class="col-md-5 pr-1">
                                <label>Working Days</label>
                                <input type="text" class="form-control" name="WorkingDays" onChange={this.handleChange} value={this.state.WorkingDays} required/>
                            </div>
                            <div class="col-md-5 pr-1">
                                <label>Working Hours</label>
                                <input type="text" class="form-control" name="WorkingHours" onChange={this.handleChange} value={this.state.WorkingHours} required/>
                            </div>
                        </div>
                        <br/>
                        <div class="row">
                            <div class="col-md-10 pr-1">
                                <div class="form-group">
                                    <div class="form-group">
                                        <label>Age Range</label>
                                    </div>
                                    <div>
                                        <input type="number" min="18" name="MinAge" onChange={this.handleChange} value={this.state.MinAge} required/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div class="row">
                            <div class="col-md-3 pr-1">
                                <div class="form-group">
                                    <label>Minimum Japanese Skill
                                        <select id="jpskill" name="JpSkill" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} value={this.state.JpSkill} required>
                                            <option value="none" label="---Select---" selected disabled hidden></option>
                                            <option value="N3"selected = {this.state.JpSkill == "N3" ? "selected" : ""} >N3</option>
                                            <option value="N2" selected = {this.state.JpSkill == "N2" ? "selected" : ""}>N2</option>
                                            <option value="N1" selected = {this.state.JpSkill == "N1" ? "selected" : ""}>N1</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3 pr-1">
                                <div class="form-group">
                                    <label>Area
                                        <select id="area" name="area" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} value={this.state.area} required>
                                            <option value="none" label="---Select---" selected disabled hidden></option>
                                            {areas && areas.map(area=>(
                                                <option value={area.id} selected = {this.state.area == area.id ? "selected" : ""} >{area.areaName}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3 pr-1">
                                <div class="form-group">
                                    <label>City
                                        <select id="cityName" name="cityName" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} value={this.state.cityName} required>
                                            <option value="none" label="---Select---" selected disabled hidden></option>
                                            {cities && cities.map(city=>(
                                                <option value={city.id} selected = {this.state.city == city.id ? "selected" : ""} >{city.name}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 pr-1">
                                <div class="form-group">
                                    <label>Job Description</label>
                                    <input type="text" class="form-control" name="JobDescription" onChange={this.handleChange} value={this.state.JobDescription} required/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 pr-1">
                                <div class="form-group">
                                    <label>Other Qualifications</label>
                                    <input type="text" class="form-control" name="Qualification" onChange={this.handleChange} value={this.state.Qualification}/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3 pr-1">
                                <div class="form-group">
                                    <label>Posted Date</label>
                                    <input type="datetime-local" class="form-control" name="PostedDate" onChange={this.handleChange} value={this.state.PostedDate} required/>
                                </div>
                            </div>
                        </div>
                    </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button onClick={this.updateJob} class="btn btn-danger" data-dismiss="modal">Update Details</button>
                    </div>
                    </div>
                </div>
                </div>

        <div className="modal fade" id="deleteConfirm" tabindex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Hey Admin !!!</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                Are You Sure to Delete the Job ?
            </div>
            <div className="modal-footer">
                <button type="button" className="btn" data-dismiss="modal" aria-label="Cancel">Cancel</button>  
                <button type="button" className="btn" data-dismiss="modal" onClick={this.deleteJob}>Delete</button>
            </div>
            </div>
        </div>
        </div>
                    <div class="wrapper ">
                        <div class="sidebar" data-color="red">
                            <div class="logo">
                                <img src="/assets/img/logoo.png" alt="Logo"/>
                                <a href="/user" class="simple-text logo-normal" style={{textAlign: "center"}}>
                                    Golden Snitch Admin
                                </a>
                            </div>
                            <div class="sidebar-wrapper" id="sidebar-wrapper">
                                <ul class="nav">
                                    <li class="active">
                                        <a href="/tables">
                                            <i class="now-ui-icons design_bullet-list-67"></i>
                                            <p>Table List</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/user">
                                            <i class="now-ui-icons users_single-02"></i>
                                            <p>User Profile</p>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                            <div class="main-panel" id="main-panel">
                                <nav class="navbar navbar-expand-lg navbar-transparent  bg-primary  navbar-absolute">
                                    <div class="container-fluid">
                                        <div class="navbar-wrapper">
                                            <div class="navbar-toggle">
                                                <button type="button" class="navbar-toggler">
                                                    <span class="navbar-toggler-bar bar1"></span>
                                                    <span class="navbar-toggler-bar bar2"></span>
                                                    <span class="navbar-toggler-bar bar3"></span>
                                                </button>
                                            </div>
                                            <a class="navbar-brand" style={{fontSize: "x-large"}}>Job Table</a>
                                        </div>
                                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                                                <span class="navbar-toggler-bar navbar-kebab"></span>
                                                <span class="navbar-toggler-bar navbar-kebab"></span>
                                                <span class="navbar-toggler-bar navbar-kebab"></span>
                                            </button>
                                        <div class="collapse navbar-collapse justify-content-end" id="navigation">
                                            <ul class="navbar-nav">
                                                <li class="nav-item">
                                                    <a class="nav-link" href="/index">
                                                        Employer
                                                    </a>
                                                </li>
                                                <li class="nav-item active">
                                                    <a class="nav-link" href="/job">
                                                        Job
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </nav>                  
                                <div class="panel-header panel-header-sm">
                                </div>
                                <div class="content">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h4 class="card-title"> Job</h4>
                                                </div>
                                                <div class="card-body">
                                                    <div class="table-responsive">
                                                        <table ref={this.datatableRef} class="table table-striped table-bordered" style={{width:100+"%"}}>
                                                            <thead style={{fontSize:12}}>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Email</th>
                                                                    <th>Phone</th>
                                                                    <th>Address</th>
                                                                    <th>Area</th>
                                                                    <th>City</th>
                                                                    <th>Employment Status</th>
                                                                    <th>Salary Range</th>
                                                                    <th>Working Days</th>
                                                                    <th>Working Hours</th>
                                                                    <th>Age Range</th>
                                                                    <th>Minimum Japanese Skill</th>
                                                                    <th>Job Description</th>
                                                                    <th>Qualification</th>
                                                                    <th>Posted Date</th>
                                                                    <th>Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                            {this.state.jobs.map(Job => (
                                                                <tr id={Job.id}>
                                                                    <td>{Job.JobName}</td>
                                                                    <td>{Job.JobEmail}</td>
                                                                    <td>{Job.JobPhone}</td>
                                                                    <td>{Job.JobAddress}</td>
                                                                    <td>{this.getArea(Job.area)}</td>
                                                                    <td>{this.getCity(Job.city)}</td>
                                                                    <td>{Job.JobStatus}</td>
                                                                    <td>{Job.MinSalary} ~ {Job.MaxSalary}</td>
                                                                    <td>{Job.WorkingDays}</td>
                                                                    <td>{Job.WorkingHours}</td>
                                                                    <td>{Job.MinAge}</td>
                                                                    <td>{Job.JpSkill}</td>
                                                                    <td>{Job.JobDescription}</td>
                                                                    <td>{Job.Qualification}</td>
                                                                    <td>{this.getDateString(Job.PostedDate)}</td>
                                                                    <td>
                                                                    <button data-toggle="modal" data-target="#jobEditModal" onClick={()=>this.passEditId(Job.id)}> Edit </button>&nbsp;
                                                                    <button data-toggle="modal" data-target="#deleteConfirm" onClick={()=>this.passDeleteId(Job.id)}>Delete</button>
                                                                    </td>
                                                                </tr>
                                                                ))  
                                                                }
                                                        </tbody>
                                                        </table>
                                                    </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer class="footer">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="inner-content">
                                            Copyright©2020 GoldenSnitch
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </body>
            </html>
        )
    };
}