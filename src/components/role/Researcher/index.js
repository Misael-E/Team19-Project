import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../../Session';
import TrackerList from './TrackerList';
import { SubmissionRequestForm } from '../../Submission';
import * as ROLES from '../../../constants/roles';
import * as ROUTES from '../../../constants/routes';

import './res.css';

const INITIAL_STATE = {
  submissionExists: false,
};

class ResearcherPage extends Component {
  constructor(props) {
    super(props);

    this.state = { ...props.location.state, };
  }

  componentDidMount() {

    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.firebase
        .user(authUser.uid)
        .on('value', snapshot => {
          if (snapshot.exists()){
            this.setState({
              submissionExists: true,
            });
          };
        });
      } else {
        console.log("error");
      }
    })
  }

  render() {
    const { submissionExists } = this.state;

    let route;
    if (submissionExists) {
      route = <Route exact path={ROUTES.RESEARCHER} component={SubmissionRequestForm} />;
    } else {
      route = <Route exact path={ROUTES.RESEARCHER} component={TrackerList} />;
    }
  return (
    <div>
      <h1 className="researcher"> Researcher </h1>
      <div className="center">
      {route}
      </div>
    </div>
  )}
}


const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(ResearcherPage);
