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
      searching: false,
      paper: null,
      revEmail: '',
      ...props.location.state,
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  requestReviewer = event => {
    const { revEmail, rev1 } = this.state;
    const reviewers = {};
    try {
      this.setState({ searching: true });
      console.log(revEmail + ' acknowledged');
      this.props.firebase.users().orderByChild('email').equalTo(revEmail).on('value', snapshot => {
        if (snapshot.exists()) {
          console.log(Object.keys(snapshot.val())[0]);
          this.setState({
            rev1: Object.keys(snapshot.val())[0],
            searching: false,
          });
        }
      })
      console.log(this.state.rev1);
      reviewers['rev1'] = this.state.rev1;
      this.props.firebase.submission(this.props.match.params.id).update({'reviewers': reviewers, });
      console.log(revEmail + ' successfully added');
    } catch (e) {
      console.log('Reviewer not added');
      e.message = `Reviewer not found`;
    }

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
          <form requestReviewer={this.requestReviewer}>
            <div className="textbox">
            <input
              name="revEmail"
              value={revEmail}
              onChange={this.onChange}
              type="text"
              placeholder="Reviewer"
            />
            </div>
          </form>
          <button
            onClick={this.requestReviewer}
            type="submit"
            className="waves-effect waves-light btn"
          >
            Search Reviewer
          </button>
          {searching && <div className="loading"> Searching ...</div>}
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
