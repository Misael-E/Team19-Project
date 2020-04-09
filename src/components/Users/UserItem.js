import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import './useritem.css';

class UserItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      ...props.location.state,
    };
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
    const { user, loading } = this.state;

    let link;
    if (!user.roles[ROLES.ADMIN]){
      link = <Link
        to={{
          pathname: `${ROUTES.ADMIN}/${user.uid}/changerole`,
          state: { user },
        }}
      >
        Change Role
      </Link>;
    } else {
      link = <strong>Administrators can't change role</strong>
    }

    return (
      <div>
        <h2 className="user">User: ({this.props.match.params.id})</h2>
        {loading && <div className="loading">Loading ...</div>}

        {user && (
          <div className="list">
            <span>
              <strong>ID:</strong> {user.uid}
            </span>
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <span>
              <strong>First Name:</strong> {user.firstName}
            </span>
            <span>
              <strong>Last Name:</strong> {user.lastName}
            </span>
            <span>
              <strong>Role:</strong>
              {user.roles[ROLES.ADMIN]}
              {user.roles[ROLES.EDITOR]}
              {user.roles[ROLES.RESEARCHER]}
              {user.roles[ROLES.REVIEWER]}
              {user.roles[ROLES.NONE]}
            </span>
            <span>
              <button
                className="reset"
                type="button"
                onClick={this.onSendPasswordResetEmail}
              >
                Send Password Reset
              </button>
            </span>
            <span>
              {link}
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default withFirebase(UserItem);
