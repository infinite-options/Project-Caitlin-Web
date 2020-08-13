import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlash, faList } from "@fortawesome/free-solid-svg-icons";

export default class ShowISList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iconShow: true,
      hasSteps: true,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.Array !== this.props.Array) {
      // console.log("is is going in here at least");
      let items = [...this.props.Array];
      // console.log("this is the item");
      // console.log("this si the for the person 2",items[this.props.Index] )
      // console.log("this is what it is supposed to be 2",items[this.props.Index]['is_sublist_available']);
      this.setState({
        iconShow: items[this.props.Index]["is_sublist_available"],
      });
    }
  }
  async componentDidMount() {
    let items = [...this.props.Array];
    await this.hasStepss();
    this.setState({
      iconShow: items[this.props.Index]["is_sublist_available"],
    });
  }

  hasStepss = async () => {
    const id = this.props.Array[this.props.Index].id;
    const res = await this.props.Path.collection("actions&tasks").doc(id).get();
    const steps = res.data()["instructions&steps"];
    // console.log("this is steps:", steps);
    if (steps.length === 0) {
      this.setState({ hasSteps: false });
    }
  };

  editFirBaseFalse = (e) => {
    this.setState({ iconShow: false });
    let items = [...this.props.Array];
    items[this.props.Index]["is_sublist_available"] = false;
    this.props.Path.update({ "actions&tasks": items }).then((doc) => {});
  };

  editFirBaseTrue = (e) => {
    this.setState({ iconShow: true });
    let items = [...this.props.Array];
    items[this.props.Index]["is_sublist_available"] = true;
    this.props.Path.update({ "actions&tasks": items }).then((doc) => {});
  };

  renderShowIcon = () => {
    return (
      <div>
        <FontAwesomeIcon
          icon={faList}
          title="Show List Item"
          style={{ color: "#D6A34C", marginLeft: "20px" }}
          // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
          onClick={(e) => {
            e.stopPropagation();
            this.editFirBaseFalse();
          }}
          size="lg"
        />
      </div>
    );
  };
  renderNotShowIcon = () => {
    return (
      <div>
        <span className="fa-layers fa-fw" style={{ marginLeft: "20px" }}>
          <FontAwesomeIcon
            style={{ color: "#000000" }}
            icon={faList}
            title="Don't Show List Item"
            onClick={(e) => {
              e.stopPropagation();
              this.editFirBaseTrue();
            }}
            size="lg"
          />
          <FontAwesomeIcon
            style={{ color: "#000000" }}
            icon={faSlash}
            title="Don't Show List Item"
            onClick={(e) => {
              e.stopPropagation();
              this.editFirBaseTrue();
            }}
            size="lg"
          />
        </span>
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.state.iconShow && this.state.hasSteps
          ? this.renderShowIcon()
          : null}
        {!this.state.iconShow && this.state.hasSteps
          ? this.renderNotShowIcon()
          : null}
      </div>
    );
  }
}
