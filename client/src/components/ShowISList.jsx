import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlash, faList} from '@fortawesome/free-solid-svg-icons';



export default class ShowISList extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            iconShow: true
        };
    }
    componentDidUpdate() {}

  componentDidMount() {
      let items = [...this.props.Array];
    //   console.log("this is the item");
    //   console.log(items[this.props.Index]);
      this.setState({iconShow: items[this.props.Index]['is_sublist_available']});
  }
    // ListFalse = e => {
    //   this.props.ListCameBackFalse();  
    //   this.setState({iconShow: !this.state.iconShow}); 
    // };

    editFirBaseFalse = e =>{
      // console.log("this should be false");
      this.setState({iconShow: false})
      // console.log(this.state.iconShow);
      let items = [...this.props.Array];
    //   console.log("this is the item");
    //   console.log(items[this.props.Index]);
      
        items[this.props.Index]['is_sublist_available'] = false;
        this.props.Path.update({ 'actions&tasks': items }).then(
            (doc) => {
            }
        )
    }

    editFirBaseTrue = e =>{
      // console.log("this should be true");
      this.setState({iconShow: true})
      // console.log(this.state.iconShow);
      let items = [...this.props.Array];
    //   console.log("this is the item");
    //   console.log(items[this.props.Index]);
        items[this.props.Index]['is_sublist_available'] = true;
        this.props.Path.update({ 'actions&tasks': items }).then(
            (doc) => {
            }
        )
    }
    render() {
        return (
            <div>
                {this.state.iconShow &&  
                    <div  >
                        <FontAwesomeIcon
                            icon={faList}
                            title = "Show List Item"
                            // onMouseOver ={event => { event.target.style.color = "#48D6D2"; }}
                            // onMouseOut ={event => {event.target.style.color = "#D6A34C";}}
                            style ={{ color:   "#D6A34C", marginLeft:"20px"}}
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                            onClick={(e)=>{ e.stopPropagation(); this.editFirBaseFalse()}}
                            //onClick={this.ListFalse}
                            size="lg" 
                            />
                    </div>
                }
                {!this.state.iconShow &&  
                  <div  
                  // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                  >
                      {/* <img src={require('../slash-list.png')} 
                      style = {{fontSize:"1.3333333333em", lineHeight: "0.75em", verticalAlign: "-0.0667em", marginLeft:"20px"}}
                       alt="Slash-List Icon"></img> */}
                    <span className ="fa-layers fa-fw" style = {{marginLeft:"20px"}} >
                      <FontAwesomeIcon
                          style ={{color:"#000000"}}
                        //   color="#000000"
                          icon={faList} 
                          title = "Don't Show List Item"
                          onClick={(e)=>{ e.stopPropagation();  this.editFirBaseTrue()}}
                          size="lg" 
                        />
                      <FontAwesomeIcon
                          style ={{color:"#000000"}}
                        //   color="#000000"
                          icon={faSlash} 
                          title = "Don't Show List Item"
                          onClick={(e)=>{ e.stopPropagation(); this.editFirBaseTrue()}}
                          size="lg" 
                      />
                    </span>
                  </div>
                }
            </div>
        )
    }
}