import React from 'react';

import { withFirebase } from '../Firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const SignOutButton = ({ firebase }) => (
  <button className="btn" type="button" onClick={firebase.doSignOut}>
      <FontAwesomeIcon icon={faSignOutAlt} size='2x'/>
  </button>
);

export default withFirebase(SignOutButton);
