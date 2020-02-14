import React, { Component } from 'react'
import { faEdit} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default class editGR extends Component {
    render() {
        return (
            <div>
                 <FontAwesomeIcon 
                    onMouseOver ={event => { event.target.style.color = "#48D6D2"; }}
                    onMouseOut ={event => {event.target.style.color = "#000000";}}
                    style ={{color:  "#000000" }}
                    onClick={(e)=>{ e.stopPropagation(); }}
                    icon={faEdit} size="1x" 
                    />
            </div>
        )
    }
}
