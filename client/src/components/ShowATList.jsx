import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlash, faList} from '@fortawesome/free-solid-svg-icons';



export default class ShowATList extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            iconShowATModal: true
        };
    }


    render() {
        return (
            <div>
                {this.state.iconShowATModal &&  
                    <div  >
                        <FontAwesomeIcon
                            icon={faList}
                            title = "Show List Item"
                            // onMouseOver ={event => { event.target.style.color = "#48D6D2"; }}
                            // onMouseOut ={event => {event.target.style.color = "#D6A34C";}}
                            style ={{ color:   "#D6A34C", marginTop:"10px"}}
                            onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: !this.state.iconShowATModal})}}
                            size="lg" 
                            />
                    </div>
                }
                {!this.state.iconShowATModal &&  
                  <div style={{ marginLeft: "10px" }} onMouseOver ={event => { event.target.style.color = "#48D6D2"; }}
                  onMouseOut ={event => {event.target.style.color = "#000000";}} 
                  onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: !this.state.iconShowATModal})}}>
                {/* <div  > */}
                    <span className ="fa-layers fa-fw" >
                      <FontAwesomeIcon
                          style ={{color:"#000000", marginTop:"10px"}}
                        //   color="#000000"
                          icon={faList} 
                          title = "Don't Show List Item"
                          onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: !this.state.iconShowATModal})}}
                          size="lg" 
                        />
                      <FontAwesomeIcon
                          style ={{color:"#000000", marginTop:"10px"}}
                        //   color="#000000"
                          icon={faSlash} 
                          title = "Don't Show List Item"
                          onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: !this.state.iconShowATModal})}}
                          size="lg" 
                      />
                    </span>
                  </div>
                }
            </div>
        )
    }
}