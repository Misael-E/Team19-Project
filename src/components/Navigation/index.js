import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import lightbulb from './Lighbulb.png';
import './nav.css';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
        <NavigationNonAuth />
      )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
  <body>
    <div className="nav">
    <div className="stick">
        <img className="logo" src={lightbulb} alt=""/>
        <h2 className="head">uScholar</h2>
        </div>
      <ul className="nav-links">
        <li className="nav-links">
          <Link to={ROUTES.HOME}>Home</Link>
        </li>
        <li className="nav-links">
          <Link to={ROUTES.LANDING}>About</Link>
        </li>
        <li className="nav-links">
          <Link to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        {!!authUser.roles[ROLES.ADMIN] && (
          <li className="nav-links">
            <Link to={ROUTES.ADMIN}>Admin</Link>
          </li>
        )}
        {!!authUser.roles[ROLES.EDITOR] && (
          <li className="nav-links">
            <Link to={ROUTES.EDITOR}>Editor</Link>
          </li>
        )}
        {!!authUser.roles[ROLES.REVIEWER] && (
          <li className="nav-links">
            <Link to={ROUTES.REVIEWER}>Reviewer</Link>
          </li>
        )}
        {!!authUser.roles[ROLES.RESEARCHER] && (
          <li className="nav-links">
            <Link to={ROUTES.RESEARCHER}>Researcher</Link>
          </li>
        )}
      </ul>
      <div className="signOut">
          <SignOutButton />
        </div>
    </div>
  </body>
);

const NavigationNonAuth = () => (
  <body>
    <div className="nav">
      <div className="stick">
        <img className="logo" src={lightbulb} alt=""/>
        <h2 className="head">uScholar</h2>
        </div>
      <ul className="nav-links">
        <li className="nav-links">
          <Link to={ROUTES.LANDING}>About</Link>
        </li>
        <li className="nav-links">
          <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
      </ul>
      <div className="burger">
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </div>
  </body>
);

export default Navigation;
