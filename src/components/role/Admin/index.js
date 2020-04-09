import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../../Session';
import { UserList, UserItem } from '../../Users';
import ChangeRole from '../ChangeRole';
import * as ROLES from '../../../constants/roles';
import * as ROUTES from '../../../constants/routes';

import './admin.css';

const AdminPage = () => (
  <div>
    <h1 className="admin">Admin</h1>
    <p className="subhead">The Admin Page is accessible by every signed in admin user.</p>

    <Switch>
      <Route exact path={ROUTES.ADMIN_ROLE_CHANGE} component={ChangeRole} />
      <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
      <Route exact path={ROUTES.ADMIN} component={UserList} />
    </Switch>
  </div>
);

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AdminPage);
