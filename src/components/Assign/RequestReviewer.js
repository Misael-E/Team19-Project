import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import './assign.css';

const REVIEWER_ADDED = 'reviewer has been added';

class RequestReviewer extends Component {
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

  requestReviewer1 = event => {
    const { revEmail, rev1 } = this.state;
    const reviewers = {};
      console.log(revEmail + ' acknowledged');
      reviewers['rev1'] = revEmail;
      this.props.firebase.submission(this.props.match.params.id).update({'reviewers': reviewers, });
      console.log(revEmail + ' successfully added');

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
      <h2 className="user"> Reviewers </h2>
      {loading && <div className="loading"> Loading ...</div>}
      {paper && (
        <div className="list">
          <span>
            <strong>Reviewer 1:</strong> {paper.reviewers['rev1']}
          </span>
          <span>
            <strong>Reviewer 2:</strong> {paper.reviewers['rev2']}
          </span>
          <span>
            <strong>Reviewer 3:</strong> {paper.reviewers['rev3']}
          </span>
          <form requestReviewer={this.requestReviewer1}>
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
            onClick={this.requestReviewer1}
            type="submit"
            className="waves-effect waves-light btn"
          >
            Search Reviewer
          </button>

        </div>
      )}
      </div>
    )
  }
}

export default withFirebase(RequestReviewer);
