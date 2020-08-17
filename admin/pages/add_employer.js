import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {loadFirebase} from '../lib/db.js'
export default class Index extends React.Component{

    constructor(){
        super();
        this.initial_state = {
            EmpName:'',
            EmpEmail:'',
            EmpPhone:'',
            EmpWebsite:'',
            EmpLocation:'',
            EmpCity:'',
            EmpAddress:''
        };
        this.state = this.initial_state;
    }
    handleChange = (event) =>{
        this.setState({[event.target.name] : event.target.value});
    }
    addEmployer= event => {
        event.preventDefault();
        let firebase = loadFirebase() 
        const userRef = firebase.firestore().collection('employer').add({
            EmpName:this.state.EmpName,
            EmpEmail:this.state.EmpEmail,
            EmpPhone:this.state.EmpPhone,
            EmpWebsite:this.state.EmpWebsite,
            EmpLocation:this.state.EmpLocation,
            EmpCity:this.state.EmpCity,
            EmpAddress:this.state.EmpAddress
        });        
        this.setState({
            EmpName:'',
            EmpEmail:'',
            EmpPhone:'',
            EmpWebsite:'',
            EmpLocation:'',
            EmpCity:'',
            EmpAddress:''
        });
    };
    render() {
        return (
            <html>
                <Head>
                    <title>Golden Snitch | Admin</title>
                </Head>
                <body class="user-profile">
                    <div class="wrapper">
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
                                    <a class="navbar-brand" style={{fontSize: "x-large"}}>Add Employer</a>
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
                                            <h5 class="title">Edit Profile</h5>
                                        </div>
                                        <div class="card-body">
                                            <form action="#" method="post" onSubmit={this.addEmployer}>
                                                <div class="row">
                                                    <div class="col-md-5 pr-1">
                                                        <div class="form-group">
                                                            <label>Name</label>
                                                            <input type="text" class="form-control" placeholder="Name" value="Name" name="EmpName" onChange={this.handleChange} value={this.state.EmpName} required/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-5 pr-1">
                                                        <div class="form-group">
                                                            <label for="exampleInputEmail1">Email</label>
                                                            <input type="email" class="form-control" placeholder="email" value="michael23@gmail.com" name="EmpEmail" onChange={this.handleChange} value={this.state.EmpEmail} required/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-5 pr-1">
                                                        <div class="form-group">
                                                            <label>Phone</label>
                                                            <input type="tel" class="form-control" placeholder="+12345678" name="EmpPhone" onChange={this.handleChange} value={this.state.EmpPhone} required/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-5 pr-1">
                                                        <div class="form-group">
                                                            <label>Website</label>
                                                            <input type="text" class="form-control" placeholder="www.michael.com" name="EmpWebsite" onChange={this.handleChange} value={this.state.EmpWebsite} onChange={this.handleChange} value={this.state.EmpWebsite} required/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3 pr-1">
                                                        <div class="form-group">
                                                            <label>Area<br/>
                                                                <select id="location" name="EmpLocation" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} value={this.state.selectedValue} required>
                                                                    <option value="none" label="---Select Location---" selected disabled hidden></option>
                                                                    <option value="Hokkaido">Hokkaido</option>
                                                                    <option value="Honshu">Honshu</option>
                                                                    <option value="Shikoku">Shikoku</option>
                                                                    <option value="Kyushu">Kyushu</option>
                                                                    <option value="Okinawa">Okinawa</option>
                                                                </select>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3 pr-1">
                                                        <div class="form-group">
                                                            <label>City<br/>
                                                                <select id="city" name="EmpCity" class="form-control" style={{fontSize: "small"}} onChange={this.handleChange} value={this.state.selectedValue} required>
                                                                    <option value="none" label="---Select City---" selected disabled hidden></option>
                                                                    <option value="Asahikawa">Asahikawa</option>
                                                                    <option value="Chitose">Chitose</option>
                                                                    <option value="Ebetsu">Ebetsu</option>
                                                                    <option value="Hakodate">Hakodate</option>
                                                                    <option value="Kitami">Kitami</option>
                                                                    <option value="Kushiro">Kushiro</option>
                                                                    <option value="Obihiro">Obihiro</option>
                                                                    <option value="Otaru">Otaru</option>
                                                                    <option value="Sapporo">Sapporo</option>
                                                                    <option value="Tomakomai">Tomakomai</option>
                                                                </select>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-10 pr-1">
                                                        <label>Address</label>
                                                        <input type="text" class="form-control" value="address" name="EmpAddress" onChange={this.handleChange} value={this.state.EmpAddress} required/>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3 pr-1"><br/>
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