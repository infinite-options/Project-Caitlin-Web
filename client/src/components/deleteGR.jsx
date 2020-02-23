import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
export default class deleteGR extends Component {

    constructor(props) {
        super(props)
        console.log('Delete AT constructor');  
       
    }

    submitRequest = () => {
        console.log("request to delete GR")
        console.log('delete index ' + this.props.deleteIndex)
        console.log(this.props.Item)
        console.log(this.props.Array)
        if (this.props.deleteIndex < 0){
            console.log("invalid index exiting delete");
            return;
        }
        this.tempdeleteArrPortion();
    } 

    tempdeleteArrPortion= () => {
        let items = [...this.props.Array];
        items[this.props.deleteIndex]['deleted'] = true;
        this.props.Path.update({ 'goals&routines': items }).then(
            (doc) => {
                console.log('updateEntireArray Finished')
                console.log(doc);
                if (this.props != null) {
                    console.log("refreshing FireBasev2 from delete GRItem");
                    this.props.refresh();
                }
                else{
                    console.log("delete failure");
                }
            }
        )
    }

    deleteArrPortion = () => {
        console.log("request was made to delete this  element " +  this.props.deleteIndex);
        let items = [...this.props.Array];
        console.log("delete with: ");
        let i = this.props.deleteIndex;
        const newArr = items.slice(0, i).concat(items.slice(i + 1, items.length));
        console.log("delete 2 with: ");
        console.log(newArr);
        this.props.Path.update({ 'goals&routines': newArr }).then(
            (doc) => {
                console.log('updateEntireArray Finished')
                console.log(doc);
                if (this.props != null) {
                    console.log("refreshing FireBasev2 from delete ISItem");
                    this.props.refresh();
                }
                else{
                    console.log("delete failure");
                }
            }
        )
    }

    confirmation = () => {
        const r = window.confirm("Confirm Delete"); 
        if(r == true){ 
            console.log("Delete Confirm")
            this.submitRequest();
            return;
        }
        console.log("Delete Not Confirm")
    }


    render() {
        return (
            <div  style={{ marginLeft: "5px" }}>
            <FontAwesomeIcon 
            title = "Delete Item"
                    onMouseOver ={event => { event.target.style.color = "#48D6D2"; }}
                    onMouseOut ={event => {event.target.style.color = "#000000";}}
                    style ={{marginRight: '15px', color:  "#000000" }}
                    onClick={(e)=>{ e.stopPropagation(); this.confirmation()}}
                    icon={faTrashAlt} size="lg" 
                    />
        </div>
        )
    }
}
