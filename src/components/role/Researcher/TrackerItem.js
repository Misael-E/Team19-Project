import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';

import './trackeritem.css';

const REVIEWER_ADDED = 'reviewer has been added';

class TrackerItem extends Component {
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
            <strong>Status:</strong> {paper.status}
          </span>
          <span>
            <strong>Title:</strong> {paper.title}
          </span>
          <span>
            <strong>Reviewers:</strong>
              {paper.reviewers['rev1']}
              {paper.reviewers['rev2']}
              {paper.reviewers['rev3']}
          </span>
          <Link to = {{ pathname: `${ROUTES.SUBMISSION_TRACKER}/${paper.uid}/requestreviewer`,
                        state: paper }}>
            <button className = "waves-effect waves-light btn">
              Nominate Peer Reviewers
            </button>

          </Link>
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

export default withFirebase(TrackerItem);
