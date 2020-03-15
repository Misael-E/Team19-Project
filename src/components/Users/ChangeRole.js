import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const INITIAL_STATE = {
  isAdmin: false,
  isResearcher: false,
  isEditor: false,
  isReviewer: false,
  error: null,
};

class ChangeRole extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      ...props.location.state,
    };
  }
  onSubmit = event => {
    const { isResearcher } = this.state;
    const roles = {};

    if (isResearcher) {
      roles[ROLES.RESEARCHER] = ROLES.RESEARCHER;
    }
  }
  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          user: snapshot.val(),
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
  };

  render() {
    const { user, loading, error, isResearcher, } = this.state;

    return (
      <div>
        <h2>User ({this.props.match.params.id})</h2>
        {loading && <div>Loading ...</div>}

        {user && (
          <div>
            <span>
              <strong>Role:</strong>
              {user.roles[ROLES.ADMIN]}
              {user.roles[ROLES.EDITOR]}
              {user.roles[ROLES.RESEARCHER]}
              {user.roles[ROLES.REVIEWER]}
            </span>
          </div>
        )}
        <h2> Assign Role: </h2>
        <form onSubmit={this.onSubmit}>
        <label>
          Researcher:
          <input
            name="isResearcher"
            type="checkbox"
            checked={isResearcher}
            onChange={this.onChangeCheckbox}
          />
        </label>
          <button type="submit">
            Change
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </div>

    );
  }
}
export default withFirebase(ChangeRole);
