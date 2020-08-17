import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {loadFirebase} from '../lib/db.js'
import { delBasePath } from 'next/dist/next-server/lib/router/router';
import { firestore } from 'firebase';
export default class Index extends React.Component{

    constructor(props){
        super(props);
    }
    state = {
        JobName:'',
        JobEmail:'',
        JobPhone:'',
        JobAddress:'',
        JobStatus:'',
        MinSalary:'',
        MaxSalary:'',
        WorkingDays:'',
        WorkingHours:'',
        Age:'',
        city : '',
        area : '',
        JpSkill:'',
        JobDescription:'',
        Qualification:'',
        PostedDate:'',
        cities : this.props.areas || [],
        showCities : false
    }
    static async getInitialProps (){
        let firebase = loadFirebase()
        let areas = []
        let cities = []

        const queyAreas = await firebase.firestore().collection('area').get()
        queyAreas.forEach(doc => {
            areas.push(Object.assign({id : doc.id,data : doc.data()}))
        })

        const queyCities = await firebase.firestore().collection('city').get()
        queyCities.forEach(doc => {
            cities.push(Object.assign({id : doc.id,data : doc.data()}))
        })

        return {cities : cities, areas : areas} 
    }
    handleChange = (event) =>{
        this.setState({[event.target.name] : event.target.value});
        if(event.target.name == "area"){
            this.getCities(event.target.value)
            this.setState({showCities : true})
        }
    }
    getCities = (id) => {
        let firebase = loadFirebase()
        let cities = []
        firebase.firestore().collection('city').where('area_id','==',id).get()
        .then(snapshot => {
            snapshot.forEach(doc=>{
                cities.push(Object.assign({id : doc.id , data : doc.data()}))
            })
            this.setState({cities : cities})    
        })
        
        }
    addJob= event => {
        event.preventDefault();
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
            Age:this.state.Age,
            city : this.state.city,
            area : this.state.area,
            JpSkill:this.state.JpSkill,
            JobDescription:this.state.JobDescription,
            Qualification:this.state.Qualification,
            PostedDate:this.state.PostedDate
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
            Age:'',
            JpSkill:'',
            city : '',
            area : '',
            JobDescription:'',
            Qualification:'',
            PostedDate:''
        });
    };
    render() {
        const areas = this.props.areas
        const cities = this.state.cities
        return (
            <html>
                <Head>
                    <title>Golden Snitch | Admin</title>
                </Head>
                <body class="user-profile">
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
                                        <a class="navbar-brand" style={{fontSize: "x-large"}}>Add Job</a>
                                    </div>
                                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                                        <span class="navbar-toggler-bar navbar-kebab"></span>
                                        <span class="navbar-toggler-bar navbar-kebab"></span>
                                        <span class="navbar-toggler-bar navbar-kebab"></span>
                                    </button>
                                </div>
                            </nav>
                            <div class="panel-header panel-header-sm">
                            </div>
                            <div class="content">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="card">
                                            <div class="card-header">
                                                <h5 class="title">Add Job</h5>
                                            </div>
                                            <div class="card-body">
                                                <form action="#" method="post" onSubmit={this.addJob}>
                                                    <div class="row">
                                                        <div class="col-md-5 pr-1">
                                                            <div class="form-group">
                                                                <label>Name</label>
                                                                <input type="text" class="form-control" placeholder="Name" value="Name" name="JobName" onChange={this.handleChange} value={this.state.JobName} required/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-5 pr-1">
                                                            <div class="form-group">
                                                                <label for="exampleInputEmail1">Email</label>
                                                                <input type="email" class="form-control" placeholder="email" value="michael23@gmail.com" name="JobEmail" onChange={this.handleChange} value={this.state.JobEmail} required/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-5 pr-1">
                                                            <div class="form-group">
                                                                <label for="exampleInputEmail1">Phone</label>
                                                                    <input type="tel" class="form-control" placeholder="+12345678" name="JobPhone" onChange={this.handleChange} value={this.state.JobPhone}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-10 pr-1">
                                                            <div class="form-group">
                                                                <label>Address</label>
                                                                <input type="text" class="form-control" value="address" name="JobAddress" onChange={this.handleChange} value={this.state.JobAddress} required/>
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
                                                            <input type="text" class="form-control" value="workingday" name="WorkingDays" onChange={this.handleChange} value={this.state.WorkingDays} required/>
                                                        </div>
                                                        <div class="col-md-5 pr-1">
                                                            <label>Working Hours</label>
                                                            <input type="text" class="form-control" value="workinghours" name="WorkingHours" onChange={this.handleChange} value={this.state.WorkingHours} required/>
                                                        </div>
                                                    </div>
                                                    <br/>
                                                    <div class="row">
                                                        <div class="col-md-10 pr-1">
                                                            <div class="form-group">
                                                                <div class="form-group">
                                                                    <label>Age Range</label>
                                                                    <input type="number" min="18" name="Age" onChange={this.handleChange} value={this.state.Age} required/>
                                                                    &nbsp;&nbsp;
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br/>
                                                    <div class="row">
                                                        <div class="col-md-3 pr-1">
                                                            <div class="form-group">
                                                                <label>Minimum Japanese Skill
                                                                    <select id="jpskill" name="JpSkill" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} value={this.state.selectedValue} required>
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
                                                                    <select id="jpskill" name="area" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} value={this.state.selectedValue} required>
                                                                        <option value="none" label="---Select---" selected disabled hidden></option>
                                                                        {areas && areas.map(area=>(
                                                                            <option value={area.id}>{area.data.areaName}</option>
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
                                                                    <select id="jpskill" name="city" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} value={this.state.selectedValue} required>
                                                                        <option value="none" label="---Select---" selected disabled hidden></option>
                                                                        {cities && cities.map(city=>(
                                                                            <option value={city.id}>{city.data.name}</option>
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
                                                                <input type="text" class="form-control" value="jobdescription" name="JobDescription" onChange={this.handleChange} value={this.state.JobDescription} required/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-12 pr-1">
                                                            <div class="form-group">
                                                                <label>Other Qualifications</label>
                                                                <input type="text" class="form-control" value="qualification" name="Qualification" onChange={this.handleChange} value={this.state.Qualification}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-3 pr-1">
                                                            <div class="form-group">
                                                                <label>Posted Date</label>
                                                                <input type="datetime-local" class="form-control" value="datetime" name="PostedDate" onChange={this.handleChange} value={this.state.PostedDate} required/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-3 pr-1">
                                                            &nbsp;
                                                            <button type="submit" class="btn btn-danger" style={{fontSize: "small"}}>Add</button>
                                                        </div>
                                                    </div>
                                                </form>
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