import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default class contact extends React.Component{
    render() {
        return (
            <html>
                <Head>
                    <title>Golden Snitch | Admin</title>
                </Head>
                <body class="">
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
                                        <a class="navbar-brand" style={{fontSize: "x-large"}}>Tables</a>
                                    </div>
                                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                                        <span class="navbar-toggler-bar navbar-kebab"></span>
                                        <span class="navbar-toggler-bar navbar-kebab"></span>
                                        <span class="navbar-toggler-bar navbar-kebab"></span>
                                    </button>
                                </div>
                            </nav>
                            
                        <div class="panel-header panel-header-lg">
                        </div>
                        <div class="content" style={{height: "fit-content"}}>
                            
                            <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                <div class="card-header">
                                    <h5 class="card-category">Go to Table</h5>
                                    <a href="/index">
                                    <h4 class="card-title"> Employer </h4>
                                    </a>
                                </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                <div class="card-header">
                                    <h5 class="card-category">Go to Table</h5>
                                    <a href="/job">
                                    <h4 class="card-title"> Job </h4>
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