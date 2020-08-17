import {loadFirebase} from '../lib/db.js'

export default class AreaInput extends React.Component{
    
    deleteAreaBlankCities = () => {
        let firebase = loadFirebase()
        firebase.firestore().collection('city').where('area_id','==','').get()
        .then(snapshot=> {
            snapshot.forEach(doc=>{
                doc.ref.delete()
            })
        })
        console.log("deleted successfully")
    }
    render (){
        const areas = this.props.areas
        return (
           <button onClick={this.deleteAreaBlankCities}>Click to Delete</button>
        )
    }
}