import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlash, faBookmark } from "@fortawesome/free-solid-svg-icons";

export default class MustDoAT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iconShow: true,
    };
  }

  /*
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.Array !== this.props.Array) {
      console.log("Enter componentDidUpdate");
      let items = [...this.props.Array];
      this.setState({
        iconShow: items[this.props.Index]["is_must_do"],
      });
    }
  }
  */

  componentDidMount() {
    console.log("Enter componentDidMount");
    let items = [...this.props.Array];
    this.setState({
      iconShow: items[this.props.Index]["is_must_do"],
    });
  }

  toggleFBmustDo = (toggle) => {
    this.setState({ iconShow: toggle });
    let items = [...this.props.Array];
    items[this.props.Index]["is_must_do"] = toggle;
    this.props.Path.update({ "actions&tasks": items }).then((doc) => {});
  };

  render() {
    return (
      <div>
        {this.state.iconShow && (
          <div>
            <FontAwesomeIcon
              icon={faBookmark}
              title="Must Do"
              style={{ color: "#D6A34C", marginLeft: "20px" }}
              // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
              onClick={(e) => {
                e.stopPropagation();
                this.toggleFBmustDo(!this.state.iconShow);
              }}
              size="lg"
            />
          </div>
        )}
        {!this.state.iconShow && (
          <div>
            <span className="fa-layers fa-fw" style={{ marginLeft: "20px" }}>
              <FontAwesomeIcon
                style={{ color: "#000000" }}
                icon={faBookmark}
                title="Optional"
                onClick={(e) => {
                  e.stopPropagation();
                  this.toggleFBmustDo(!this.state.iconShow);
                }}
                size="lg"
              />
              <FontAwesomeIcon
                style={{ color: "#000000" }}
                icon={faSlash}
                title="Optional"
                onClick={(e) => {
                  e.stopPropagation();
                  this.toggleFBmustDo(!this.state.iconShow);
                }}
                size="lg"
              />
            </span>
          </div>
        )}
      </div>
    );
  }
}
