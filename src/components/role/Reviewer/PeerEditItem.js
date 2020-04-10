import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';

import './peeredit.css';

class PeerEditItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      paper: null,
      ...props.location.state,
    };
  }

  handleDownload = () => {
    window.open(this.state.paper.downloadURL);
  }

  componentDidMount() {
    if (this.state.paper) {
      return;
    }

    this.setState({ loading: true });

    this.props.firebase
      .submission(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          paper: snapshot.val(),
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.submission(this.props.match.params.id).off();
  }

  render() {
    const { paper, loading } = this.state;

    return (
      <div>
      <h2 className="user"> Submission Details ({this.props.match.params.id}) </h2>
      {loading && <div className="loading"> Loading ...</div>}
      {paper && (
        <div className="list">
          <span>
            <strong>Submission ID:</strong> {paper.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {paper.email}
          </span>
          <span>
            <strong>Title:</strong> {paper.title}
          </span>
          <span>
            <strong>Deadline: </strong> {(new Date(paper.deadline).toString())}
          </span>
          <button
            onClick={this.handleDownload}
            className="waves-effect waves-light btn"
          >
            Download
          </button>
        </div>
      )}
      </div>
    )
  }
}

export default withFirebase(PeerEditItem);
