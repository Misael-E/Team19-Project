import React from 'react';

import { withFirebase } from '../Firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const SignOutButton = ({ firebase }) => (
  <button className="btn" type="button" onClick={firebase.doSignOut}>
      <FontAwesomeIcon icon={faSignOutAlt} size='2x' color='#e2e2e2'/>
  </button>
);

export default withFirebase(SignOutButton);
