import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';
import './submissionsList.css';


class SubmissionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submissionsInProgress: [],
      submissionsAccepted: [],
      submissionsRejected: []
    };
  };


  componentDidMount(){


    // Get the submissions in progress
    this.props.firebase.submissions().orderByChild('status').equalTo('in progress').on('value', snapshot => {
      if (snapshot.exists()) {
        const submissionsObject = snapshot.val();

        const submissionsList = Object.keys(submissionsObject).map(key => ({
          ...submissionsObject[key],
          submissionID: key,
        }));


      console.log(Object.keys(submissionsObject));
      console.log(submissionsList);

        this.setState({
          submissionsInProgress: submissionsList,
        });
      };
    });

    // Get the accepted submissions
    this.props.firebase.submissions().orderByChild('status').equalTo('accepted').on('value', snapshot => {
      if (snapshot.exists()) {
        const submissionsObject = snapshot.val();

        const submissionsList = Object.keys(submissionsObject).map(key => ({
          ...submissionsObject[key],
          submissionID: key,
        }));


      console.log(Object.keys(submissionsObject));
      console.log(submissionsList);

        this.setState({
          submissionsAccepted: submissionsList,
        });
      };
    });

    // Get the rejected submissions
    this.props.firebase.submissions().orderByChild('status').equalTo('rejected').on('value', snapshot => {
      if (snapshot.exists()) {
        const submissionsObject = snapshot.val();

        const submissionsList = Object.keys(submissionsObject).map(key => ({
          ...submissionsObject[key],
          submissionID: key,
        }));


      console.log(Object.keys(submissionsObject));
      console.log(submissionsList);

        this.setState({
          submissionsRejected: submissionsList,
        });
      };
    });


  }

  componentWillUnmount() {
    this.props.firebase.submissions().off();
  }


  render(){
    return(
      <div id="outer">
      <div id="info">
      <div>
      <h2 id="headerCenter">In Progress</h2>
          <table>
              <tr>
                <th>Submission</th>
                <th>Deadline</th>
                <th></th>
              </tr>
          {this.state.submissionsInProgress.map(submission => (
              <tr key={submission.submissionID}>
                <td>{submission.title}</td>
                <td>{(new Date(submission.deadline)).toString()}</td>
                <td>
                    <Link
                      to={{
                        pathname: `${ROUTES.EDITOR}/${submission.submissionID}`,
                        state: { submission },
                      }}
                    >
                      View/Edit
                    </Link>
                </td>
              </tr>
          ))}
        </table>

      </div>
      <div>
      <h2 id="headerCenter">Accepted</h2>
            <table>
                <tr>
                  <th>Submission</th>
                  <th>Deadline</th>
                  <th></th>
                </tr>
            {this.state.submissionsAccepted.map(submission => (
                <tr key={submission.submissionID}>
                  <td>{submission.title}</td>
                  <td>{(new Date(submission.deadline)).toString()}</td>
                  <td>
                      <Link
                        to={{
                          pathname: `${ROUTES.EDITOR}/${submission.submissionID}`,
                          state: { submission },
                        }}
                      >
                        View/Edit
                      </Link>
                  </td>
                </tr>
            ))}
          </table>
      </div>
      <div>
      <h2 id="headerCenter">Rejected</h2>
    
            <table>
                <tr>
                  <th>Submission</th>
                  <th>Deadline</th>
                  <th></th>
                </tr>
            {this.state.submissionsRejected.map(submission => (
                <tr key={submission.submissionID}>
                  <td>{submission.title}</td>
                  <td>{(new Date(submission.deadline)).toString()}</td>
                  <td>
                      <Link
                        to={{
                          pathname: `${ROUTES.EDITOR}/${submission.submissionID}`,
                          state: { submission },
                        }}
                      >
                        View/Edit
                      </Link>
                  </td>
                </tr>
            ))}
          </table>
      </div>
      </div>
      </div>
    )
  }
}

export default withFirebase(SubmissionsList);
