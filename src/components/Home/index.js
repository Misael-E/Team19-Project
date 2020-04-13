import React from 'react';
import { compose } from 'recompose';
import { withAuthorization, withEmailVerification } from '../Session';
import './home.css';

const HomePage = () => (
  <div className="container">
    <div className="content">
      <h1>Home</h1>
    </div>
    <p>Process Here</p>
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);
