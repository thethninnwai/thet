import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {db, getCollectionRecords, AREA_COLLECTION, CITY_COLLECTION, EMPLOYER_COLLECTION, JOB_COLLECTION} from "../lib/db";

export default class index extends React.Component{

  state = {
    area : '',
    city : '',
    JobStatus : '',
    MinSalary : '',
    JpSkill : '',
    posted_within : '',
    regenerated_jobs : this.props.jobs || [],
    showCities : false,

    currentPage : 1,
    firstIndex : 0,
    lastIndex : 6,
    pages : Math.ceil(this.props.jobs.length/6),
    entryPerPage : 6,
    forWardBtn : true,
    backWardBtn : false,
  }

  static async getInitialProps({res,req,quey}){
    const jobs = await getCollectionRecords(JOB_COLLECTION)
    const areas = await getCollectionRecords(AREA_COLLECTION)
    const cities = await getCollectionRecords(CITY_COLLECTION)
    const employers = await getCollectionRecords(EMPLOYER_COLLECTION)

    return {jobs,areas,cities,employers}
  }
  getJobCount = (id) =>{
    let count = 0
    this.props.jobs.map(job=> {
      (job.data.area == id || job.data.city == id) && count ++
    })
    return count
  }
  handleChange = (event) => {
    this.setState({[event.target.name] : event.target.value})
    if(event.target.name == "area"){
      this.getCities(event.target.value)
      
    }
    if(event.target.name == "entryPerPage"){
      this.setState({
          currentPage : 1,
          firstIndex : 0,
          lastIndex : parseInt(event.target.value),
          forWardBtn : true,
          backWardBtn : false,
          pages : Math.ceil(this.state.regenerated_jobs.length/parseInt(event.target.value))
          })
    }
  }
  getCities = (id) => {
    let cities = []
    if(id == ""){
      this.setState({city : ""})
      this.setState({showCities : false})
    }else {
      this.props.cities.map(city => {
        city.data.area_id == id && cities.push(Object.assign({id : city.id, data : city.data}))
      })
      this.setState({dynamic_cities : cities})
      this.setState({showCities : true})
    }
  }

  getEmployer = (id) => {
    let ename = ''
    this.props.employers.map(employer => {
      if(employer.id == id){
        ename = employer.data.EmpName
      }
    })
    return ename
  }

  applyFilter = async () => {
    this.setState({
    currentPage : 1,
    firstIndex : 0,
    lastIndex : 6,
    entryPerPage : 6,
    forWardBtn : true,
    backWardBtn : false
    })
    console.log(this.state)
    let jobs = []
    let toReturnJobs = []
    let REGENERATED_IDS = []
    console.log("stateis ")
    console.log(this.state)
    const today = new Date()
    try{
      let query = db.collection('job')
      if(this.state.JobStatus !== ""){
          query = query.where('JobStatus','==',this.state.JobStatus)
      }
      if(this.state.area !== ""){
          query = query.where('area','==',this.state.area)
      }
      if(this.state.city !== ""){
          query = query.where('city','==',this.state.city)
      }
      if(this.state.MinSalary !== ""){
          query = query.where('MinSalary','>=',parseInt(this.state.MinSalary))
          query = query.orderBy("MinSalary")
      }
      if(this.state.JpSkill !== ""){
          query = query.where('JpSkill','<=',parseInt(this.state.JpSkill))
          query = query.orderBy("JpSkill")
      }

      query.orderBy("PostedDate").get()
      .then(snaphsot => {
          snaphsot.forEach(doc=>{

              if(this.state.posted_within !== ""){
                  if(this.state.posted_within == '1'){
                      if(this.checkDateEqual(doc.data().PostedDate)){
                              jobs.push(Object.assign({
                                  id : doc.id,
                                  data : doc.data()
                              }))
                      }
                  }else if(this.state.posted_within == '2'){
                      if(this.checkDateLastThreeDays(doc.data().PostedDate)){
                              jobs.push(Object.assign({
                                  id : doc.id,
                                  data : doc.data()
                              }))
                      }
                  }else if(this.state.posted_within == '3'){
                      if(this.checkDateLastSevenDays(doc.data().PostedDate)){
                              jobs.push(Object.assign({
                                  id : doc.id,
                                  data : doc.data()
                              }))
                      }
                  }else if(this.state.posted_within == '4'){
                      if(this.checkDateThisMonth(doc.data().PostedDate)){
                          jobs.push(Object.assign({
                              id : doc.id,
                              data : doc.data()
                          }))
                      }
                  }
              }else
              {
                  jobs.push(Object.assign({
                      id : doc.id,
                      data : doc.data()
                  }))
              }
              
          })

          REGENERATED_IDS = [...new Set(jobs.reverse().map(job => job.id))] 
          console.log(REGENERATED_IDS)
          if(REGENERATED_IDS.length > 0){
              REGENERATED_IDS.forEach(id => {
                  db.collection('job').doc(id).get()
                  .then(snapshot=>{
                      toReturnJobs.push(Object.assign({id : id , data : snapshot.data()}))
                      this.setState({regenerated_jobs : toReturnJobs})
                      this.setState({noFoundCondition : false})
                      this.setState({pages : Math.ceil(toReturnJobs.length/5)})
                  })
              })
              
          }else {
              this.setState({noFoundCondition : true})
              this.setState({regenerated_jobs : []})
          }
      })
  }catch(error){
      console.log(error)
  }
    
}

getDateString = (obj) => {
  var t = new Date(1970, 0, 1);
  t.setSeconds(obj.seconds);
  // console.log(t)
  // console.log(t.getDate()+1+'/'+(t.getMonth()+1)+'/'+t.getFullYear()+' '+ t.getHours()+':'+ t.getMinutes()+':'+ t.getSeconds()+'-'+t.getTimezoneOffset())
  return t.getDate()+1+'-'+(t.getMonth()+1)+'-'+t.getFullYear()
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

checkDateEqual = (dateobj) => {
  const today = new Date()
  var d = new Date(1970, 0, 1);
  d.setSeconds(dateobj.seconds)
  if(d.getDate()+1 == today.getDate()){
      return true
  }else return false
}
checkDateLastThreeDays = (dateobj) => {
  const today = new Date()
  var d = new Date(1970, 0, 1);
  d.setSeconds(dateobj.seconds)
  console.log(`Last 3 days is ${today.getDate()-3}`)
  if(today.getDate()-3 <= d.getDate()+1 && d.getDate()+1 <= today.getDate()){
      return true
  }else return false
}
checkDateLastSevenDays = (dateobj) => {
  const today = new Date()
  var d = new Date(1970, 0, 1);
  d.setSeconds(dateobj.seconds)
  console.log(`Last 3 days is ${today.getDate()-7}`)
  if(today.getDate()-7 <= d.getDate()+1 && d.getDate()+1 <= today.getDate()){
      console.log("true")
      return true
  }else return false
}
checkDateThisMonth = (dateobj) => {
  let today = new Date()
  var d = new Date(1970, 0, 1);
  d.setSeconds(dateobj.seconds)
  if(Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) ) /(1000 * 60 * 60 * 24) )<= 30){
      console.log("true")
      return true
  }else {
      console.log("false")
      return false
  }
}

reGenerateJobs = (event) => {
  let jobs = []
  this.setState({[event.target.name] : event.target.value})
  if(this.state.regenerated_jobs.length == this.props.jobs.length){
      if(event.target.value == "old_to_new")
      {
          try{
              db.collection('job').orderBy('PostedDate').get()
              .then(snaphsot => {
                  snaphsot.forEach(doc=>{
                      jobs.push(Object.assign({
                          id : doc.id,
                          data : doc.data()
                      }))
                  })
                  this.setState({regenerated_jobs : jobs})
              })
          }catch(error){
              console.log(error)
          }
      }else if(event.target.value == "new_to_old")
      {
          
          try{
              db.collection('job').orderBy('PostedDate').get()
              .then(snaphsot => {
                  snaphsot.forEach(doc=>{
                      jobs.push(Object.assign({
                          id : doc.id,
                          data : doc.data()
                      }))
                  })
                  this.setState({regenerated_jobs : jobs.reverse()})
              })
          }catch(error){
              console.log(error)
          }
      }
  } else {
      jobs = this.state.regenerated_jobs
      if(event.target.value == "old_to_new"){
          jobs.sort(function(a, b) {
              return a.data.posted_date - b.data.posted_date;
          })
          this.setState({regenerated_jobs : jobs})
      }else if(event.target.value == "new_to_old"){
          jobs.sort(function(a, b) {
              return b.data.posted_date - a.data.posted_date;
          })
          this.setState({regenerated_jobs : jobs})
      }
      
  }

  }

  goPrevious = () => {
  let firstIndex = 0
  this.setState({currentPage : this.state.currentPage-1})
  this.state.currentPage < 3 && this.setState({backWardBtn : false}) 
  this.state.currentPage <= this.state.pages && this.setState({forWardBtn : true}) 
      let lastIndex = this.state.firstIndex
      if(lastIndex==parseInt(this.state.entryPerPage)){
          firstIndex = 0
      }else{
          firstIndex =  lastIndex-parseInt(this.state.entryPerPage)
      }
      
  this.setState({firstIndex : firstIndex})
  this.setState({lastIndex : lastIndex})

  }
  goForward = () => {
  this.setState({currentPage : this.state.currentPage+1})
  this.state.currentPage == this.state.pages-1 && this.setState({forWardBtn : false}) 
  this.state.currentPage >= 1 && this.setState({backWardBtn : true}) 
  this.setState({currentPage : this.state.currentPage+1})
  this.setState({firstIndex : this.state.lastIndex})
  this.setState({lastIndex : this.state.lastIndex+parseInt(this.state.entryPerPage)})

  }

  render() {
    return (

<html>
  <Head>

    <title>Golden Snitch | Job FInding Website</title>
  </Head>

  <body> 
   
    <header className="">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="/index"><h2>Golden<em>Snitch</em></h2></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                    <Link href="/">
                    <a className="nav-link">Home
                      <span className="sr-only">(current)</span>
                    </a>
                    </Link>
                </li> 
                <li className="nav-item float-right">
                    <Link href="/contact">
                  <a className="nav-link">Contact us</a>
                  </Link>
                </li>
                <li>
                  <a href="/user-registration">Sign in</a>&emsp;
                  <img src="/assets/images/nurse-rabbit.png" alt="User" style={{width: 45, height: 45}}/>
                </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <div className="page-heading about-heading header-text" style={{backgroundImage: "url(/assets/images/heading-6-1920x500.jpg)"}}>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="text-content">
              <h2>Jobs</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="products">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
             <div className="contact-form">
                <div>
                 <h5 style={{marginBottom: 15}}>Location</h5>

                 <div>
                      <label>
                        <select id="area" name="area" onChange={this.handleChange} value={this.state.area}>
                          <option value="" label="---Select Location---"></option>
                          {this.props.areas && this.props.areas.map(area => (
                            <option value={area.id}>{area.data.areaName}({this.getJobCount(area.id)})</option>
                          ))}
                      </select>
                      </label>
                 </div>
                 <br/>

                 {this.state.showCities && (
                   <React.Fragment>
                     <h5 style={{marginBottom: 15}}>City</h5>
                        <div>
                              <label>
                                <select id="city" name="city" onChange={this.handleChange} value={this.state.city}>
                                  <option value="" label="---Select City---"></option>
                                  {this.state.dynamic_cities && this.state.dynamic_cities.map(city => (
                                    <option value={city.id}>{city.data.name}({this.getJobCount(city.id)})</option>
                                  ))}
                                </select>
                              </label>
                          </div>
                   </React.Fragment>
                 )}

                 <br/>

                 <h5 style={{marginBottom: 15}}>Employment Status</h5>

                 <select name="JobStatus" onChange={this.handleChange} value={this.state.JobStatus}>
                 <option value="" label="---Select Employment Status---"></option>
                   <option value="full time">Full Time</option>
                   <option value="part time">Part Time</option>
                 </select>

                 <br/>

                 <h5 style={{marginBottom: 15}}>Minimum Expected Salary</h5>

                 <div>
                      <label>
                        <small>Minimum (yen): </small>
                           <input type="number" min="1" max="9999999" name="MinSalary" onChange={this.handleChange} value={this.state.MinSalary} />
                      </label>
                 </div>

                 <br/>


                 <h5 style={{marginBottom: 15}}>Minimum Japanese Skill</h5>
                    <select name="JpSkill" onChange={this.handleChange} value={this.state.JpSkill}>
                      <option value="" label="---Select Japanese Skill---"></option>
                      <option value="1">N1</option>
                      <option value="2">N2</option>
                      <option value="3">N3</option>
                    </select>
                 <br/>

                 <h5 style={{marginBottom: 15}}>Posted Within</h5>
                 <select name="posted_within" className="form-control" value={this.state.posted_within} onChange={this.handleChange}>
                      <option value="">All Time</option>
                      <option value="1">Today</option>
                      <option value="2">Last 3 Days</option> 
                      <option value="3">Last 7 Days</option> 
                      <option value="4">Last 30 Days</option>  
                  </select>
                  <br/>
                 <div>
                  <button className="filled-button" onClick={this.applyFilter}>Search</button>
                 </div>
            </div>
             </div>
          </div>

          <div className="col-md-9">
            {/* {this.state.pages && <div>{`pages is ${this.state.pages}`}</div>}
            {this.state.currentPage && <div>{`current page is ${this.state.currentPage}`}</div>}
            {this.state.firstIndex && <div>{`first index is ${this.state.firstIndex}`}</div>}
            {this.state.lastIndex && <div>{`last index is ${this.state.lastIndex}`}</div>} */}

            <div className="row">
            <h3 style={{width : 45+"%"}}>{this.state.regenerated_jobs.length} Jobs Found</h3>
            <div  style={{width : 25+"%"}}>
              <span>Show</span>
                  <select name="entryPerPage" style={{marginRight : 1+"em" , marginLeft : 1 + "em"}} onChange={this.handleChange}>
                      <option value="5">6</option>
                      <option value="12">12</option>
                      <option value="24">24</option>
                      <option value="60">60</option>
                  </select>
                  <span>Entries</span>
              </div>
              <div style={{width : 30+"%"}}>
                <span>Sort by</span>
                  <select name="sortby" style={{marginLeft : 1+"em"}} onChange={this.reGenerateJobs}>
                      <option value="new_to_old">Newest to Oldest</option>
                      <option value="old_to_new">Oldest to Newest</option>
                  </select>
              </div>    
              
                
            </div>
            
            <br/>
            <div className="row">
              {this.state.regenerated_jobs && this.state.regenerated_jobs.slice(this.state.firstIndex,this.state.lastIndex).map(job => (
                <Link href={`/job_details?id=${job.id}`}>
                  <div className="col-md-6">
                <div className="product-item">
                  <div className="down-content">
                    <Link href={`/job_details?id=${job.id}`}>
                    <a>
                      <h4>{job.data.JobName}<br/>
                        <a style={{fontSize: 11}}>&#62;&#62; Click here for more details &#60;&#60;</a>
                      </h4>
                    </a>
                    </Link>
                    
                      <p>{job.data.JobDescription}</p>
                    <h6>{job.data.MinSalary} Yen ~{job.data.MaxSalary} Yen</h6>

                    <h4><small><strong><i className="fa fa-building"></i> {this.getEmployer(job.data.JEmployer)}</strong></small></h4>

                    <small>
                        <strong title="Posted on"><i className="fa fa-calendar"></i> {` ${this.getDateString(job.data.PostedDate)}`}</strong> &nbsp;&nbsp;&nbsp;&nbsp;
                         <strong title="Type"><i className="fa fa-file"></i>{` ${job.data.JobStatus}`}</strong> &nbsp;&nbsp;&nbsp;&nbsp;
                         <strong title="Location"><i className="fa fa-map-marker"></i> {` ${this.getLocation(job.data.city,job.data.area)}`}</strong>
                    </small>
                  </div>
                </div>
              </div>
                </Link>
                
              ))}
              

              

              <div className="col-md-12">
                <ul className="pages" style={{float: "right"}}>
                  {this.state.backWardBtn && <li><a onClick={this.goPrevious}><i className="fa fa-angle-double-left"></i></a></li>}
                  {this.state.forWardBtn && this.state.regenerated_jobs.length > this.state.pages && this.state.entryPerPage < this.state.regenerated_jobs.length && <li><a onClick={this.goForward}><i className="fa fa-angle-double-right"></i></a></li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="best-features">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="section-heading">
              <h2>About Us</h2>
            </div>
          </div>
          <div>
            <div className="left-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Praesent semper feugiat nibh sed pulvinar proin gravida hendrerit lectus.
                Dolor morbi non arcu risus quis varius. Nisi est sit amet facilisis.
                Ac tincidunt vitae semper quis. Odio morbi quis commodo odio aenean sed.
                Lectus mauris ultrices eros in cursus. Sapien nec sagittis aliquam malesuada bibendum. 
                Metus dictum at tempor commodo ullamcorper a lacus vestibulum. Non consectetur a erat nam at.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="call-to-action">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="inner-content">
              <div className="row">
                <div className="col-md-8">
                  <h4>For more information, contact us:</h4>
                  <ul className="featured-list">
                    <li>Phone:&emsp;011-4029082</li>
                    <li>Email:&emsp;consectetur@gmail.com</li>
                    <li>Address:&emsp;aquecorporis nulla aspernatur, Hokkaido, Japan.</li>
                  </ul>
                  </div>

                <div className="col-lg-4 col-md-6 text-right">
                  <a href="/contact" className="filled-button">Contact Us</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="inner-content">
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