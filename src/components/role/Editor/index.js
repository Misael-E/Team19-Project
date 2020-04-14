import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../../Session';
import { ResearcherList, ResearcherItem, ReviewerList, ReviewerItem } from '../../Users';
import * as ROLES from '../../../constants/roles';
import * as ROUTES from '../../../constants/routes';
import Firebase from '../../Firebase';
import SubmissionsList from './SubmissionsList';
import SubmissionItem from './SubmissionItem';
import './submissionsList.css';

const EditorPage = () => (

  <div>
    <div id ="editorPage"><h1>Editor's Page</h1></div>
    <Switch>
      <Route exact path={ROUTES.EDITOR} component={SubmissionsList} />
      <Route exact path={ROUTES.VIEW_SUBMISSION_DETAILS} component={SubmissionItem} />
    </Switch>
    {/* <Switch>
      <Route exact path={ROUTES.EDITOR} component={ResearcherList} />
      <Route exact path={ROUTES.VIEW_RESEARCHER_DETAILS} component={ResearcherItem} />
    </Switch>
    <Switch>
      <Route exact path={ROUTES.EDITOR} component={ReviewerList} />
      <Route exact path={ROUTES.VIEW_REVIEWER_DETAILS} component={ReviewerItem} />
    </Switch> */}
  </div>
);

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.EDITOR];

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(EditorPage);
