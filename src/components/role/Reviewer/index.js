import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import PeerEditList from './PeerEditList';
import PeerEditItem from './PeerEditItem';
import { withAuthorization, withEmailVerification } from '../../Session';
import * as ROLES from '../../../constants/roles';
import * as ROUTES from '../../../constants/routes';

import './rev.css';

const ReviewerPage = () => (
  <div>
    <h1 className="reviewer"> Reviewer </h1>
      <div className="center">
        <Switch>
          <Route exact path={ROUTES.REVIEWER} component={PeerEditList} />
          <Route exact path={ROUTES.VIEW_PEER_EDIT_DETAILS} component={PeerEditItem} />
        </Switch>
      </div>
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(ReviewerPage);
