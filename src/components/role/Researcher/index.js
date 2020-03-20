import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../../Session';
import { SubmissionRequestForm } from '../../Submission';
import * as ROLES from '../../../constants/roles';
import * as ROUTES from '../../../constants/routes';

const ResearcherPage = () => (
  <div>
    <h1> Researcher </h1>
    <Route exact path={ROUTES.RESEARCHER} component={SubmissionRequestForm} />
  </div>

);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(ResearcherPage);
