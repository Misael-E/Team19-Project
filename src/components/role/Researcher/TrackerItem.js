import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

class TrackerItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      papers: [],    
      revEmail: '',
    };
  }

  requestReviewer = search => {
    const { revEmail } = this.state;
    try {
      this.props.firebase.user().orderByChild('email').equalTo(revEmail).on('value', snapshot => {
        if (snapshot.exists()) {
          this.setState({
            rev1: snapshot.val().uid,
          });
        }
      })
    } catch (e) {
      console.log('Error');
      e.message = `Reviewer not found`;
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.firebase.submissions().orderByChild('userID').equalTo(this.props.firebase.auth.currentUser.uid)
          .on('value', snapshot => {
          if (snapshot.exists()) {
            const papersObject = snapshot.val();

            const paperList = Object.keys(papersObject).map(key => ({
              ...papersObject[key],
              uid: key,
            }));

            this.setState({
              papers: paperList,
              loading: false,
            });
          };
        });
      } else {
        console.log("error");
      }
    })
  }

  componentWillUnmount() {
    this.props.firebase.submissions().off();
  }

  render() {
    const { papers, loading } = this.state;

    return (
      <div>
      <h1> Track Your Submissions </h1>
      {loading && <div>Loading ...</div>}
        <table>
              <tr>
                <th>Submission ID</th>
                <th>E-Mail</th>
                <th>Status</th>
                <th>Title</th>
                <th></th>
              </tr>
          {papers.map(paper => (
              <tr key={paper.uid}>
                <td>{paper.userID}</td>
                <td>{paper.email}</td>
                <td>{paper.status}</td>
                <td>{paper.title}</td>

                </tr>
            ))}
          </table>
          <form requestReviewer={this.requestReviewer}>
            <div className="textbox">
            <input
              name="revEmail"
              value={revEmail}
              onChange={this.onChange}
              type="text"
              placeholder="Reviewer"
            />
            </div>
          </form>
          <button
            onClick={this.requestReviewer}
            className="waves-effect waves-light btn"
          >
            Search Reviewer
          </button>
        </div>
    )
  }
}

export default withFirebase(TrackerItem);
