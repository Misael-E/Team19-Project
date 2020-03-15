import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../../Session';

const EditorPage = () => (
  <div>
    <h1>Editor</h1>
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(EditorPage);
