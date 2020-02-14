import React, { Component } from 'react'
import {  Col } from 'react-bootstrap';
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

    render() {
        return (
            <Col lg={2} >
            <FontAwesomeIcon 
                    onMouseOver ={event => { event.target.style.color = "#48D6D2"; }}
                    onMouseOut ={event => {event.target.style.color = "#000000";}}
                    style ={{color:  "#000000" }}
                    onClick={(e)=>{ e.stopPropagation(); this.submitRequest()}}
                    icon={faTrashAlt} size="1x" 
                    />
        </Col>
        )
    }
}
