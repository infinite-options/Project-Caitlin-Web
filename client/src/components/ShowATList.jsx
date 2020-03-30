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
                            style ={{ color:   "#D6A34C", marginLeft:"20px"}}
                            onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: !this.state.iconShowATModal})}}
                            size="lg" 
                            />
                    </div>
                }
                {!this.state.iconShowATModal &&  
                  <div  
                  onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: !this.state.iconShowATModal})}}>
                      {/* <img src={require('../slash-list.png')} 
                      style = {{fontSize:"1.3333333333em", lineHeight: "0.75em", verticalAlign: "-0.0667em", marginLeft:"20px"}}
                       alt="Slash-List Icon"></img> */}
                    <span className ="fa-layers fa-fw" style = {{marginLeft:"20px"}} >
                      <FontAwesomeIcon
                          style ={{color:"#000000"}}
                        //   color="#000000"
                          icon={faList} 
                          title = "Don't Show List Item"
                          onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: !this.state.iconShowATModal})}}
                          size="lg" 
                        />
                      <FontAwesomeIcon
                          style ={{color:"#000000"}}
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