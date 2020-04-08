import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';

import './trackeritem.css';

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
          console.log(snapshot.val());
          this.setState({
            rev1: snapshot.val(),
            searching: false,
          });
        }
        console.log('rev doesnt exist');
      })
      console.log(this.state.rev1);
      reviewers['rev1'] = this.state.rev1;
      this.props.firebase.submission(this.props.match.params.id).update({'reviewers': rev1, });
      console.log(revEmail + ' successfully added');
    } catch (e) {
      console.log('Reviewer not added');
      e.message = `Reviewer not found`;
    }

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
              {paper.rev1}
              {paper.rev2}
              {paper.rev3}
          </span>
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
            className="waves-effect waves-light btn"
          >
            Search Reviewer
          </button>
          {searching && <div className="loading"> Searching ...</div>}
        </div>
      )}
      </div>
    )
  }
}

export default withFirebase(TrackerItem);
