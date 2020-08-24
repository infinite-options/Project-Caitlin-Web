import React, { Component } from "react";
// import { Button, Row, Col, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
/**
 *
 * This class is responsible for adding a new elemnt to the
 * firebase database. If it becomes successful then we update
 * the view on the firebasev2
 */
export default class DeleteISItem extends Component {
  constructor(props) {
    super(props);
    console.log("DeleteISItem constructor");
    console.log(this.props);
    // console.log('delete index ' + this.props.deleteIndex)
    // console.log(this.props.ISItem)
    // console.log(this.props.ISArray)
  }

  componentDidMount() {
    // console.log('DeleteISItem did mount');
  }

  submitRequest = () => {
    //Delete from the firebase
    /*const url = "https://cors-anywhere.herokuapp.com/https://us-central1-project-caitlin-c71a9.cloudfunctions.net/RecursiveDelete";
        const Data = {
            data : {
                "path" : this.props.ISItem.fbPath.path //<<<<< Entire path of the document to delete
            }
        };
        console.log("path " +  this.props.ISItem.fbPath.path);
        
        const param = {
            headers:{
                //"content-type":"application/json; charset=UTF-8"
                "content-type": "application/json"
            },
            body: JSON.stringify(Data),
            method: "POST"
        };
        
        fetch(url, param)
        .then((response) => response.json())
        .then((result) => { console.log(result); } )
        .catch((error) => { console.error(error); });*/

    // console.log("request was made to delete for element " +  this.props.deleteIndex);
    let items = [...this.props.ISArray];
    // console.log("delete with: ")
    console.log(items);
    let i = this.props.deleteIndex;
    const newArr = items.slice(0, i).concat(items.slice(i + 1, items.length));
    // console.log("delete 2 with: ")
    console.log(newArr);
    this.props.ISItem.fbPath
      .update({ "instructions&steps": newArr })
      .then((doc) => {
        // console.log('updateEntireArray Finished')
        // console.log(doc);
        if (this.props != null) {
          this.props.updateNewWentThroughISDelete(
            this.props.ISItem.fbPath.path.split("/")[3]
          );
          //   console.log(this.props.ISItem.fbPath.path);
          // console.log("refreshing FireBasev2 from delete ISItem");
          this.props.refresh(newArr);
        } else {
          console.log("delete failure");
        }
      });
  };

  confirmation = () => {
    const r = window.confirm("Confirm Delete");
    if (r === true) {
      // console.log("Delete Confirm")
      this.submitRequest();
      return;
    }
    console.log("Delete Not Confirm");
  };

  render() {
    return (
      <div>
        <FontAwesomeIcon
          onMouseOver={(event) => {
            event.target.style.color = "#48D6D2";
          }}
          onMouseOut={(event) => {
            event.target.style.color = "#000000";
          }}
          style={{ color: "#000000", marginRight: "15px", marginLeft: "5px" }}
          onClick={(e) => {
            e.stopPropagation();
            this.confirmation();
          }}
          icon={faTrashAlt}
          size="lg"
        />
      </div>
    );
  }
}
