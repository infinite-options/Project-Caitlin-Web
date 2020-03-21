import React, { Component } from 'react'
// import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
export default class deleteAT extends Component {

    constructor(props) {
        super(props)
        // console.log('Delete AT constructor');
    }

    /**
     * Does a check to make sure the element is within bounds and then calls then right function to
     * delete the stupid AT
    */
    submitRequest = () => {
        // console.log("request to delete AT")
        // console.log('delete index ' + this.props.deleteIndex)
        // console.log(this.props.Item)
        // console.log(this.props.Array)
        if (this.props.deleteIndex < 0) {
            console.log("deleteAT index error")
            return;
        }
        this.tempdeleteArrPortion();
    }

    tempdeleteArrPortion = () => {
        // console.log("request was made to delete this index " + this.props.deleteIndex);
        let items = [...this.props.Array];
        // console.log("delete with: ");
        // console.log(items);
        let i = this.props.deleteIndex;
        items[i]['deleted'] = true;
        this.props.Item.fbPath.update({ 'actions&tasks': items }).then(
            (doc) => {
                // console.log('updateEntireArray Finished')
                // console.log(doc);
                if (this.props != null) {
                    // console.log("refreshing FireBasev2 from delete ISItem");
                    this.props.refresh(items);
                }
                else {
                    console.log("delete failure");
                }
            }
        )
    }


    /**
     * 
     * deleteArrPortion :
     * this function will go into the array of that action&task and delete that specific element, after which
     * it will update the array in firestore and refresh the page once that is completed
    */
    deleteArrPortion = () => {
        // console.log("request was made to delete this  element " + this.props.deleteIndex);
        let items = [...this.props.Array];
        // console.log("delete with: ");
        // console.log(items);
        let i = this.props.deleteIndex;
        const newArr = items.slice(0, i).concat(items.slice(i + 1, items.length));
        // console.log("delete 2 with: ");
        // console.log(newArr);
        this.props.Item.fbPath.update({ 'actions&tasks': newArr }).then(
            (doc) => {
                // console.log('updateEntireArray Finished')
                // console.log(doc);
                if (this.props != null) {
                    // console.log("refreshing FireBasev2 from delete ISItem");
                    this.props.refresh(newArr);
                }
                else {
                    console.log("delete failure");
                }
            }
        )
    }

    
    confirmation = () => {
        const r = window.confirm("Confirm Delete"); 
        if(r == true){ 
            // console.log("Delete Confirm")
            this.submitRequest();
            return;
        }
        // console.log("Delete Not Confirm")
    }

    render() {
        return (
            <div style={{ marginLeft: "5px" }} >
                <FontAwesomeIcon
                    onMouseOver={event => { event.target.style.color = "#48D6D2"; }}
                    onMouseOut={event => { event.target.style.color = "#000000"; }}
                    style ={{marginRight: '15px', color:  "#000000" }}
                    onClick={(e) => { e.stopPropagation(); this.confirmation() }}
                    icon={faTrashAlt} size="lg"
                />
            </div>
        )
    }
}
