import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {loadFirebase} from '../lib/db.js'
export default class Employer extends React.Component{
    constructor (props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.datatableRef = React.createRef();
        this.$datatable = null

        this.state = {
            showCities : false,
            employers : props.employers || [],
            areas : props.areas || [],
            jobs : props.jobs || [],
            cities : props.cities || []
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
        Employer
            .getInitialProps()
            .then((response)=>{
                this.setState({
                    employers : response.employers,
                    jobs : response.jobs
                })
            }
        )
       }

    static async getInitialProps() {
        let firebase = await loadFirebase() 

        const jobQuerySnapshotJob = await firebase
            .firestore()
            .collection("job")
            .get();
        const jobs = jobQuerySnapshotJob.docs.map((doc) =>({
            ...doc.data(),
            id: doc.id,
        }));

        const jobQuerySnapshotEmp = await firebase
            .firestore()
            .collection("employer")
            .get();
        const employers = jobQuerySnapshotEmp.docs.map((doc) =>({
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
        return {jobs,employers, areas, cities}
      }
    
      addJob= event => {
        event.preventDefault();
        const today = new Date()
        console.log(this.state)
        let firebase = loadFirebase() 
        const userRef = firebase.firestore().collection('job').add({
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
            city : this.state.city,
            area : this.state.EmpLocation,
            JpSkill:this.state.JpSkill,
            JEmployer : this.state.JEmployer,
            JobDescription:this.state.JobDescription,
            Qualification:this.state.Qualification,
            PostedDate:today
        });        
        this.setState({
            JobName:'',
            JobEmail:'',
            JobPhone:'',
            JobAddress:'',
            JobStatus:'',
            MinSalary:'',
            MaxSalary:'',
            WorkingDays:'',
            WorkingHours:'',
            MinAge:'',
            JpSkill:'',
            city : '',
            area : '',
            JEmployer : '',
            JobDescription:'',
            Qualification:'',
            PostedDate:'',
            showCities : false
        });
        this.refreshTable()
    }
    handleChange = (event) => {
        this.setState({[event.target.name] : event.target.value})
        if(event.target.name == "EmpLocation"){
            this.getCities(event.target.value)
            this.setState({showCities : true})
        }
    }
    getCities = (id) => {
        let firebase = loadFirebase()
        let cities = []
        firebase.firestore().collection('city').where('area_id','==',id).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                cities.push(Object.assign({id : doc.id,...doc.data()}))
            })
            this.setState({cities : cities})
        })
    }
    getJobCount=(id)=> {
        let firebase = loadFirebase()
        let count = 0
        this.state.jobs.map(job=>{
            if(job.JEmployer == id){
                count ++
            }
            
        })
        return count
    }

    passAddId = (id) => {
        this.setState({JEmployer : id})
    }
    passEditId = (id) => {
        this.setState({edit_id : id})
        let firebase=loadFirebase()
        let data={}
        try {
            firebase.firestore().collection('employer').doc(id).get().then((snapshot)=>{
                data=snapshot.data()
                console.log(data)
                this.setState({
                    EmpName:data.EmpName,
                    EmpEmail:data.EmpEmail,
                    EmpAddress:data.EmpAddress,
                    EmpCity:data.EmpCity,
                    EmpLocation:data.EmpLocation,
                    EmpPhone:data.EmpPhone,
                    EmpWebsite:data.EmpWebsite
                })
            })
        }catch(error){
            console.log(error)
        }
    }
    passDeleteId = (id) => {
        this.setState({delete_id : id})
    }

    updateEmployer = () => {
        let firebase=loadFirebase()
        try{
            firebase.firestore().collection('employer').doc(this.state.edit_id).update({
                EmpName:this.state.EmpName,
                EmpEmail:this.state.EmpEmail,
                EmpAddress:this.state.EmpAddress,
                EmpCity:this.state.EmpCity,
                EmpLocation:this.state.EmpLocation,
                EmpPhone:this.state.EmpPhone,
                EmpWebsite:this.state.EmpWebsite
            });
            this.refreshTable();
        }catch(error){
            console.log(error)
        }
    }
    deleteEmployer = () => {
        let firebase=loadFirebase()
        try{
            firebase.firestore().collection('employer')
            .doc(this.state.delete_id)
            .delete();
            this.refreshTable();
        }catch(error){
            console.log(error)
        }
    }
    render(){
        const employer = this.state.employers
        const areas = this.state.areas
        const cities = this.state.cities
        return (
            <html>
                <Head>
                    <title>Golden Snitch | Admin</title>
                </Head>
                <body class="">
                    <div class="wrapper ">

                    <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit Employer</h5>
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
                                    <input type="text" class="form-control" name="EmpName" onChange={this.handleChange} value={this.state.EmpName} required/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 pr-1">
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Email</label>
                                    <input type="email" class="form-control" name="EmpEmail" onChange={this.handleChange} value={this.state.EmpEmail} required/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 pr-1">
                                <div class="form-group">
                                    <label>Phone</label>
                                    <input type="tel" class="form-control" name="EmpPhone" onChange={this.handleChange} value={this.state.EmpPhone} required/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 pr-1">
                                <div class="form-group">
                                    <label>Website</label>
                                    <input type="text" class="form-control" name="EmpWebsite" value={this.state.EmpWebsite} onChange={this.handleChange} value={this.state.EmpWebsite} required/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3 pr-1">
                                <div class="form-group">
                                    <label>Area<br/>
                                        <select id="location" name="EmpLocation" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} value={this.state.EmpLocation} required>
                                        
                                            {areas && areas.map(area=>(
                                                <option value={area.id} selected = {this.state.area == area.id ? "selected" : ""} >{area.areaName}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-3 pr-1">
                                <div class="form-group">
                                    <label>City<br/>
                                        <select id="city" name="EmpCity" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} value={this.state.EmpCity} required>
                                        
                                            {cities && cities.map(city=>(
                                                <option value={city.id} selected = {this.state.city == city.id ? "selected" : ""} >{city.name}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-10 pr-1">
                                <label>Address</label>
                                <input type="text" class="form-control" name="EmpAddress" onChange={this.handleChange} value={this.state.EmpAddress} required/>
                            </div>
                        </div>
                    </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button onClick={this.updateEmployer} class="btn btn-danger" data-dismiss="modal">Update Details</button>
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
                        Are You Sure to Delete the Employer ?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn" data-dismiss="modal" aria-label="Cancel">Cancel</button>  
                        <button type="button" className="btn" data-dismiss="modal" onClick={this.deleteEmployer}>Delete</button>
                    </div>
                    </div>
                </div>
                </div>

                <div class="modal fade" id="addJobModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add Job</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form action="#">
                            <div class="row">
                                <div class="col-md-5 pr-1">
                                    <div class="form-group">
                                        <label>Name</label>
                                        <input type="text" class="form-control" placeholder="Name" name="JobName" onChange={this.handleChange} required/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-5 pr-1">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Email</label>
                                        <input type="email" class="form-control" placeholder="email" name="JobEmail" onChange={this.handleChange}  required/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-5 pr-1">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Phone</label>
                                            <input type="tel" class="form-control" placeholder="+12345678" name="JobPhone" onChange={this.handleChange}/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-10 pr-1">
                                    <div class="form-group">
                                        <label>Address</label>
                                        <input type="text" class="form-control" name="JobAddress" onChange={this.handleChange} required/>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-md-3 pr-1">
                                    <div class="form-group">
                                        <label>Employment Status <br/>
                                            <select id="job_sts" name="JobStatus" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} required>
                                                <option value="none" label="--Select Employment Status--" selected disabled hidden></option>
                                                <option value="full time">Full Time</option>
                                                <option value="part time">Part Time</option>
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
                                        <input type="number" min="100,000" name="MinSalary" onChange={this.handleChange} required/>
                                        &nbsp;&nbsp;
                                        <a style={{fontSize: "small"}}>Maximum</a>&nbsp;
                                        <input type="number" min="100,000" name="MaxSalary" onChange={this.handleChange} required/>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-md-5 pr-1">
                                    <label>Working Days</label>
                                    <input type="text" class="form-control" name="WorkingDays" onChange={this.handleChange} required/>
                                </div>
                                <div class="col-md-5 pr-1">
                                    <label>Working Hours</label>
                                    <input type="text" class="form-control" name="WorkingHours" onChange={this.handleChange} required/>
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
                                            <input type="number" min="18" name="MinAge" onChange={this.handleChange} required/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-md-3 pr-1">
                                    <div class="form-group">
                                        <label>Minimum Japanese Skill
                                            <select id="jpskill" name="JpSkill" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} required>
                                                <option value="none" label="---Select---" selected disabled hidden></option>
                                                <option value="N3">N3</option>
                                                <option value="N2">N2</option>
                                                <option value="N1">N1</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3 pr-1">
                                    <div class="form-group">
                                        <label>Area
                                            <select id="area" name="EmpLocation" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} required>
                                                <option value="none" label="---Select---" selected disabled hidden></option>
                                                {areas && areas.map(area=>(
                                                    <option value={area.id}>{area.areaName}</option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {this.state.showCities && (
                                <div class="row">
                                <div class="col-md-3 pr-1">
                                    <div class="form-group">
                                        <label>cities
                                            <select id="city" name="city" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} required>
                                                <option value="none" label="---Select---" selected disabled hidden></option>
                                                {cities && cities.map(city=>(
                                                    <option value={city.id}>{city.name}</option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                </div>
                                </div>
                            )}
                            
                            <div class="row">
                                <div class="col-md-12 pr-1">
                                    <div class="form-group">
                                        <label>Job Description</label>
                                        <input type="text" class="form-control" name="JobDescription" onChange={this.handleChange}  required/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 pr-1">
                                    <div class="form-group">
                                        <label>Other Qualifications</label>
                                        <input type="text" class="form-control" name="Qualification" onChange={this.handleChange} />
                                    </div>
                                </div>
                            </div>
                           
                           
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button onClick={this.addJob} class="btn btn-danger" data-dismiss="modal">Add Job</button>
                    </div>
                    </div>
                </div>
                </div>

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
                                        <a class="navbar-brand" style={{fontSize: "x-large"}}>Employer Table</a>
                                    </div>
                                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                                            <span class="navbar-toggler-bar navbar-kebab"></span>
                                            <span class="navbar-toggler-bar navbar-kebab"></span>
                                            <span class="navbar-toggler-bar navbar-kebab"></span>
                                        </button>
                                    <div class="collapse navbar-collapse justify-content-end" id="navigation">
                                        <ul class="navbar-nav">
                                            <li class="nav-item active">
                                                <a class="nav-link" href="/index">
                                                    Employer
                                                </a>
                                            </li>
                                            <li class="nav-item">
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
                                                <h4 class="card-title"> Employer</h4>
                                            </div>
                                            <div class="card-body">
                                                <div class="table-responsive">
                                                    <table id="example" ref={this.datatableRef} class="table table-striped table-bordered">
                                                        <thead style={{fontSize:12}}>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Phone</th>
                                                                <th>Website</th>
                                                                <th>Area</th>
                                                                <th>City</th>
                                                                <th>Address</th>
                                                                <th>Job Count</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {employer &&  employer.map(Employer => (
                                                                <tr id={Employer.id}>
                                                                    <td>{Employer.EmpName}</td>
                                                                    <td>{Employer.EmpEmail}</td>
                                                                    <td>{Employer.EmpPhone}</td>
                                                                    <td>{Employer.EmpWebsite}</td>
                                                                    <td>{Employer.EmpLocation}</td>
                                                                    <td>{Employer.EmpCity}</td>
                                                                    <td>{Employer.EmpAddress}</td>
                                                                    <td>{this.getJobCount(Employer.id)}</td>
                                                                    <td>
                                                                        <button data-toggle="modal" data-target="#addJobModal" onClick={()=>this.passAddId(Employer.id)} type="button"> Add </button>&nbsp;
                                                                        <button data-toggle="modal" data-target="#editModal" onClick={()=>this.passEditId(Employer.id)} type="submit"> Edit </button>&nbsp;
                                                                        <button data-toggle="modal" data-target="#deleteConfirm" onClick={()=>this.passDeleteId(Employer.id)} type="submit">Delete</button>
                                                                    </td>
                                                                </tr>
                                                                ))
                                                                }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <a href="/add_employer">
                                                    <button class="btn btn-danger" type="submit">Add Employer</button>
                                                </a>
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
    }
}