import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {db,getCollectionRecords,AREA_COLLECTION,CITY_COLLECTION,EMPLOYER_COLLECTION} from '../lib/db'

export default class contact extends React.Component{

  static async getInitialProps ({req,res,query}){
    let job = {}

    let areas = await getCollectionRecords(AREA_COLLECTION)
    let cities = await getCollectionRecords(CITY_COLLECTION)
    let companies = await getCollectionRecords(EMPLOYER_COLLECTION)

    const querySnapshot = await db.collection('job').doc(query.id).get()
    job = querySnapshot.data()

    return {job,areas,cities,companies}
}

getDateString = (obj) => {
  var t = new Date(1970, 0, 1);
  t.setSeconds(obj.seconds);
  // console.log(t)
  // console.log(t.getDate()+1+'/'+(t.getMonth()+1)+'/'+t.getFullYear()+' '+ t.getHours()+':'+ t.getMinutes()+':'+ t.getSeconds()+'-'+t.getTimezoneOffset())
  return t.getDate()+1+'/'+(t.getMonth()+1)+'/'+t.getFullYear()
  }

  filterShow = () => {
  }

  getLocation = (city_id,area_id) => {
    const cities = this.props.cities
    const areas = this.props.areas
    let city_name = ''
    let area_name = ''

    cities.map(city=>{
        if(city.id == city_id){
            city_name = city.data.name
        }
    })
    areas.map(area=>{
        if(area.id == area_id){
            area_name = area.data.areaName
        }
    })
return city_name + "," + area_name
}

  render() {
    return (

<html>
        
          <Head>
        
            <title>Golden Snitch | Job FInding Website</title>
          </Head>
        
        <body> 

            <header class="">
              <nav class="navbar navbar-expand-lg">
                <div class="container">
                  <a class="navbar-brand" href="index.html"><h2>Golden<em>Snitch</em></h2></a>
                  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                  </button>
                  <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item active">
                          <Link href="/">
                          <a class="nav-link">Home
                            </a>
                          </Link>
                            
                        </li> 
                        <li class="nav-item"><a class="nav-link" href="/contact">Contact us</a></li>
                        <li>
                          <a href="/user-registration">Sign in</a>&emsp;
                          <img src="/assets/images/nurse-rabbit.png" alt="User" style={{width: 45, height: 45}}/>
                        </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </header>

            <div class="page-heading about-heading header-text" style={{backgroundImage: "url(/assets/images/heading-6-1920x500.jpg)"}}>
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="text-content">
                      <h2>{this.props.job.JobName}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        
            <div class="products">
              <div class="container">
                <div class="row">
                  <div>
                      <p class="lead">
                           <div class="contact-form">
                            <div class="form-group">
                              <button type="submit" class="filled-button btn-block" style={{width: 200, float: "right"}}>Apply for this job</button>
                            </div>
                          </div>
                          <i class="fa fa-map-marker"></i> {this.getLocation(this.props.job.city,this.props.job.area)} &nbsp;&nbsp;
                          <i class="fa fa-calendar"></i> {this.getDateString(this.props.job.PostedDate)} &nbsp;&nbsp;
                          <i class="fa fa-file"></i> {this.props.job.JobStatus}
                      </p>
        
                      <br/>
                      <br/>
                      
                      <div class="form-group">
                      <h5>{this.props.job.JobDescription}</h5>
                      </div>
        
                      <p>{this.props.job.JobQualification}</p>   
        
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem voluptatem vero culpa rerum similique labore, nisi minus voluptatum numquam fugiat. <br/><br/>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat fugit sint reiciendis quas temporibus quam maxime nulla vitae consectetur perferendis, fugiat assumenda ex dicta molestias soluta est quo totam cum?</p> 
        
                      <br/>
                      <br/>
                  </div>
        
                  <div class="col-md-3 col-sm-4">
                    
        
                    <br/>
                    <br/>
                  </div>
                </div>
              </div>
            </div>
        
            <div class="section">
              <div class="container">
                <div class="row">
                  <div class="col-md-9">
                    <div class="section-heading">
                      <h2>About Cannon Guards Security ltd</h2>
                    </div>
        
                    <p class="lead">
                           <i class="fa fa-map-marker"></i> London 
                      </p>
        
                    <p>Looking to improve the security at your place of business? If so, we will provide you with the trained security officers and professionally licensed personnel needed for any business. From a security guard for construction site security to private event security, you can be sure to get the very best from our staff. Alternatively we provide tailor-made security guard training for your existing security staff.</p>
                    <br/>
                    <p>Looking to improve the security at your place of business? If so, we will provide you with the trained security officers and professionally licensed personnel needed for any business. From a security guard for construction site security to private event security, you can be sure to get the very best from our staff. Alternatively we provide tailor-made security guard training for your existing security staff.</p>
                  </div>
        
                  <div class="col-md-3">
                    <div class="section-heading">
                      <h2>Contact Details</h2>
                    </div>
                    
                    <div class="left-content">
                      <p>
                        <span>Name</span>
        
                        <br/>
        
                        <strong>John Smith</strong>
                      </p>
        
                      <p>
                        <span>Phone</span>
        
                        <br/>
                        
                        <strong>
                          <a href="tel:123-456-789">123-456-789</a>
                        </strong>
                      </p>
        
                      <p>
                        <span>Email</span>
        
                        <br/>
                        
                        <strong>
                          <a href="mailto:john@carsales.com">john@carsales.com</a>
                        </strong>
                      </p>
        
                      <p>
                        <span>Website</span>
        
                        <br/>
                        
                        <strong>
                          <a href="http://www.cannonguards.com/">http://www.cannonguards.com/</a>
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        
            <div class="call-to-action">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="inner-content">
                      <div class="row">
                        <div class="col-md-8">
                          <h4>For more information, contact us:</h4>
                          <ul class="featured-list">
                            <li>Phone:&emsp;<a href="tel:011-4029082">011-4029082</a></li>
                            <li>Email:&emsp;<a href="mailto:consectetur@gmail.com">consectetur@gmail.com</a></li>
                            <li>Address:&emsp;aquecorporis nulla aspernatur, Hokkaido, Japan.</li>
                          </ul>
                          </div>
        
                        <div class="col-lg-4 col-md-6 text-right">
                          <a href="/contact" class="filled-button">Contact Us</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        
            
            <footer>
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
        
        </body>
        
    </html>
        
    )
  }
}