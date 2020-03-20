import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../../Session';
import { ResearcherList, ResearcherItem, ReviewerList, ReviewerItem } from '../../Users';
import * as ROLES from '../../../constants/roles';
import * as ROUTES from '../../../constants/routes';
import Firebase from '../../Firebase';
import PapersList from './PapersList';

const EditorPage = () => (

  <div>
    <h1>Editor</h1>
    <PapersList></PapersList>
    <Switch>
      <Route exact path={ROUTES.EDITOR} component={ResearcherList} />
      <Route exact path={ROUTES.VIEW_RESEARCHER_DETAILS} component={ResearcherItem} />
    </Switch>
    <Switch>
      <Route exact path={ROUTES.EDITOR} component={ReviewerList} />
      <Route exact path={ROUTES.VIEW_REVIEWER_DETAILS} component={ReviewerItem} />
    </Switch>
  </div>
);

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.EDITOR];

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(EditorPage);
