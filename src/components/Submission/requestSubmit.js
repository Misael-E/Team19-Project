import React, { Component } from 'react';

import Firebase, { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const INITIAL_STATE = {
  isChecked: false,

};

class SubmissionRequestForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.location.state
    };
  }
  onSubmit = event => {
    const { isChecked } = this.state;
    const submission = {};
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render(){
    return(
      <div>
        <h1> Request Submission </h1>
      </div>
    );
  }
}

export default withFirebase(SubmissionRequestForm);
