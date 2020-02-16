import React, { Component } from 'react'
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListGroup, Button, Row, Col, Modal, InputGroup, FormControl } from 'react-bootstrap';


export default class editIS extends Component {

    constructor(props) {
        super(props)
        console.log('editIs constructor');
        console.log('Edit index ' + this.props.i)
        console.log(this.props.FBPath)
        console.log(this.props.ISArray)

        this.state = {
            showEditModal: false,
            itemToEdit: this.props.ISArray[this.props.i]
        }
    }

    newInputSubmit = () => {
        console.log("submitting edited formed to firebase");
        let newArr  = this.props.ISArray;
        newArr[this.props.i] = this.state.itemToEdit;

        this.props.FBPath.update({ 'instructions&steps': newArr }).then(
            (doc) => {
                console.log('updateEntireArray Finished')
                console.log(doc);
                if (this.props != null) {
                    console.log("refreshing FireBasev2 from updating ISItem");
                    this.props.refresh(newArr);
                }
                else{
                    console.log("update failure");
                }
            }
        )
    }

    editISForm = () => {
        return (
                    <div>
                    <label>Title</label>
                    <div className="input-group mb-3" >
                        <input style={{ width: '200px' }} placeholder="Enter Title" value={this.state.itemToEdit.title} onChange={
                            (e) => { let temp = this.state.itemToEdit; temp.title = e.target.value; this.setState({itemToEdit:temp})  }
                            } />
                    </div >

                    

                    <Button variant="secondary" onClick={(e) => {e.stopPropagation(); this.setState({ showEditModal: false }) }}>Close</Button>
                    <Button variant="info" onClick={(e) => { e.stopPropagation(); this.newInputSubmit() }}>Save changes</Button>
               </div>
        )
    }

    render() {
        return (
            <div>
                {(this.state.showEditModal ? this.editISForm() : <div> </div>)}
                <FontAwesomeIcon
                    onMouseOver={event => { event.target.style.color = "#48D6D2"; }}
                    onMouseOut={event => { event.target.style.color = "#000000"; }}
                    style={{ color: "#000000" }}
                    onClick={(e) => { e.stopPropagation(); this.setState({ showEditModal: true }) }}
                    icon={faEdit} size="1x"
                />
            </div>
        )
    }
}
