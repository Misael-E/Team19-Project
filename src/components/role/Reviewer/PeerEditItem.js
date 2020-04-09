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
      searching: false,
      paper: null,
      revEmail: '',
      ...props.location.state,
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


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
    const { paper, loading, searching, revEmail } = this.state;

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
            <strong>Status:</strong> {paper.status}
          </span>
          <span>
            <strong>Title:</strong> {paper.title}
          </span>
          <span>
            <strong>Reviewers:</strong>
              {paper.rev1}
              {paper.rev2}
              {paper.rev3}
          </span>

        </div>
      )}
      </div>
    )
  }
}

export default withFirebase(PeerEditItem);
