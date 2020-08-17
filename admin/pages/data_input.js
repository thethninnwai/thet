import {loadFirebase} from '../lib/db.js'

export default class AreaInput extends React.Component{
    static async getInitialProps ({req,res,query}){
        let firebase = loadFirebase()
        let areas = []
        const querySnapshotUser = await firebase.firestore().collection('area').get()

        querySnapshotUser.forEach(doc => {
            areas.push(Object.assign(
                {id : doc.id,
              data : doc.data()}
            ))
          })
        return {areas}
    }
    state = {
        cities : [
            "Matsuyama",
            "Imabari",
            "Niihama",
            "Saijo",
            "Shikokuchuo",
            "Uwaima",
            "Ozu",
            "Seiyo",
            "Lyo",
            "Yawatahama",
            "Toon",
            "Masaki",
            "Ainan",
            "Tobe",
            "Uchiko",
            "Kihoku",
            "Ikata",
            "Kumakagen",
            "Kamijima"

        ],
        area_id : ''
    }

    handleChange = (event)=>{
        this.setState({[event.target.name] : event.target.value})
        console.log(event.target.value)
    }
    handleSubmit = (event) => {
        event.preventDefault()
        let firebase = loadFirebase()
        for(var i = 0;i<this.state.cities.length;i++){
            try{
                firebase.firestore().collection('city').add({name : this.state.cities[i], area_id : this.state.area_id})
                console.log(`new city added ${this.state.name}`)
            }catch (error){
                console.log(error)
            }
        }
        
    } 
    render (){
        const areas = this.props.areas
        return (
            <form>
                
                <select name="area_id" onChange={this.handleChange}>
                    {areas && areas.map(area => (
                        <option value={area.id}>{area.data.areaName}</option>
                    ))}
                </select>
                <button onClick={this.handleSubmit}>Submit</button>
            </form>
        )
    }
}