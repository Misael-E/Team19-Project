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

// Index of Editor Page:
//    Editor page content directory
// 


// EditorPage
//    details: Adds HTML header and directory/routes to page
//    params: none
//    return: none
//
const EditorPage = () => (
  <div>
    <div id ="editorPage"><h1>Editor's Page</h1></div>
    <Switch>
      <Route exact path={ROUTES.EDITOR} component={SubmissionsList} />
      <Route exact path={ROUTES.VIEW_SUBMISSION_DETAILS} component={SubmissionItem} />
    </Switch>
  </div>
);


// condition
//    details: Checks that the role/editor authorization
//    params: none
//    return: none
//
const condition = authUser =>
  authUser && !!authUser.roles[ROLES.EDITOR];



// export
//    details: exports the editor page
//    params: none
//    return: none
//
export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(EditorPage);
