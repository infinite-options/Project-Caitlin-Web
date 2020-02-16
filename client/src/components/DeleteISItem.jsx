import React, { Component } from 'react'
import { ListGroup, Button, Row, Col, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
/**
 * 
 * This class is responsible for adding a new elemnt to the
 * firebase database. If it becomes successful then we update
 * the view on the firebasev2
*/
export default class DeleteISItem extends Component {

    constructor(props) {
        super(props)
        console.log('DeleteISItem constructor');
        console.log('delete index ' + this.props.deleteIndex)
        console.log(this.props.ISItem)
        console.log(this.props.ISArray)
    }

    componentDidMount() {
        console.log('DeleteISItem did mount');
    }


    submitRequest = () => {
        console.log("request was made to delete for element " +  this.props.deleteIndex);
        let items = [...this.props.ISArray];
        console.log("delete with: ")
        console.log(items)
        let i = this.props.deleteIndex;
        const newArr = items.slice(0, i).concat(items.slice(i + 1, items.length))
        console.log("delete 2 with: ")
        console.log(newArr)
        this.props.ISItem.fbPath.update({ 'instructions&steps': newArr }).then(
            (doc) => {
                console.log('updateEntireArray Finished')
                console.log(doc);
                if (this.props != null) {
                    console.log("refreshing FireBasev2 from delete ISItem");
                    this.props.refresh(newArr);
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
            <Col lg={1} >
                <FontAwesomeIcon 
                        onMouseOver ={event => { event.target.style.color = "#48D6D2"; }}
                        onMouseOut ={event => {event.target.style.color = "#000000";}}
                        style ={{color:  "#000000" }}
                        onClick={(e)=>{e.stopPropagation(); this.confirmation()}}
                        icon={faTrashAlt} size="1x" 
                        />
                {/* <FontAwesomeIcon
                    onMouseOver={event => { event.target.style.color = "#48D6D2"; }}
                    onMouseOut={event => { event.target.style.color = "#000000"; }}
                    style={{ color: "#000000" }}
                    onClick={() => { console.log("delete confirm") }}
                    icon={faCheck} size="1x"
                />

                <FontAwesomeIcon
                    onMouseOver={event => { event.target.style.color = "#48D6D2"; }}
                    onMouseOut={event => { event.target.style.color = "#000000"; }}
                    style={{ color: "#000000" }}
                    onClick={() => { console.log("delete cancel") }}
                    icon={faTimes} size="1x"
                /> */}

            </Col>
        )
    }
}
