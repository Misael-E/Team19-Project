import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROLES from '../../../constants/roles';
import * as ROUTES from '../../../constants/routes';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './submissionsList.css';
import Select from 'react-select'
import { withFirebase } from '../../Firebase';

// 
// Submissions List: 
//    Editor page for viewing a list of submissions
// 

class SubmissionItem extends Component {

  // Constructor
  //    details: Initializes view of specific paper
  //    params: (props): the submission being viewed 
  //    return: n/a
  //
  constructor(props) {
    super(props);

    this.state = {
      viewOnly: true,
      submission: null,
      ...props.location.state,
      newDeadline: new Date(props.location.state.submission.deadline),
      newStatus: (props.location.state.submission.status),
      savedChangesMsg: ''
    };

    console.log(this.state.newDeadline);
  }

  // handleChange
  //    details: Updates state if new deadline/datepicker-module is changed
  //    params: date - the new date
  //    return: none
  //
  handleChange = date => {
    this.setState({
      newDeadline: date
    });
  };

  // handleStatus
  //    details: Updates state if new status (accepted/rejected/in progress) is changed
  //    params: status - the new status
  //    return: none
  //
  handleStatus = status => {
    this.setState({
      newStatus: status.value
    });
  };

  // componentDidMount()
  //    details: Upon loading page, gets submission data from firebase database
  //    params: none
  //    return: none
  //
  componentDidMount() {
    if (this.state.submission) {
      return;
    }
    this.props.firebase
      .submission(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          submission: snapshot.val(),
        });
      });
  }


  // saveEdit()
  //    details: Saves updated data on page to the firebase database
  //    params: none
  //    return: none
  //
  saveEdit() {

    // Get submission key/ID and 'update' fields in firebase
    const submissionKey = this.props.match.params.id;
    this.props.firebase.specifiedRef('Submissions/' + submissionKey).set({
      title: this.state.submission.title,
      downloadURL: this.state.submission.downloadURL,
      email: this.state.submission.email,
      reviewers: this.state.submission.reviewers,
      userID: this.state.submission.userID,
      status: this.state.newStatus,
      deadline: this.state.newDeadline.getTime()
    },
    // Return an error if it fails
    function(error) {
      if (error) {
        // The write failed...
        console.log('write failed');
      } else {
        // Data saved successfully!
        console.log('write success');
      }
    }
    // If successful, write a changes saved message!
    ).then(() => {
      this.props.firebase
      .submission(this.props.match.params.id)
      .once('value', snapshot => {
        this.setState({
          submission: snapshot.val(),
          savedChangesMsg: 'Changes saved!'
        });
      });



    });
  }


  // componentWillUnmount()
  //    details: Once leaving page, stop 'listening' to firebase
  //    params: none
  //    return: none
  //
  componentWillUnmount() {
    this.props.firebase.submission(this.props.match.params.id).off();
  }


  // render()
  //    details: Render HTML components of page / display
  //    params: none
  //    return: render HTML page
  //
  render() {

    // Create a constant for getting state of page
    const { submission } = this.state;

    // Set options for status of paper
    const options = [
      { value: 'accepted', label: 'Accept' },
      { value: 'rejected', label: 'Reject' },
      { value: 'in progress', label: 'Place In Progress' }
    ]

    // HTML design of page
    return (
      <div id="outer">
        {submission && (
          <div id="info">

            {/* Make a Submissions Title */}
            <h2 id="headerCenter">{submission.title}</h2>

            {/* Make a table for the submission details */}
            <table>
              {/* Submission Title */}
              <tr>
                  <th>Submission Title: </th>
                  <td>{submission.title}</td>
              </tr>
              {/* Submission Deadline */}
              <tr>
                  <th>Deadline: </th>
                  <td>{(new Date(submission.deadline)).toString()}</td>
              </tr>
              {/* Change Deadline */}
              <tr>
                  <th>Enter a new deadline: </th>
                  <td>{
                    <DatePicker
                    selected={this.state.newDeadline}
                    onChange={this.handleChange}
                  />
                  }</td>
              </tr>
              {/* Download Paper */}
              <tr>
                  <th>Download Paper: </th>
                  <td>{
                    <a id="downloadPDF" href={submission.downloadURL}>Download PDF</a>
                  }</td>
              </tr>
              {/* Accept/Reject Submission, or place 'In Progress' */}
              <tr>
                  <th>Accept/Reject: </th>
                  <td>{
                    <Select 
                    options={options}
                    onChange={this.handleStatus}
                    />
                  }</td>
              </tr>
            </table>

            {/* Save Changes Button */}
            <Link id="linkButton" onClick={this.saveEdit.bind(this)}>Save</Link>
            {this.state.savedChangesMsg}

            {/* Go-Back-To-List-of-Submissions Button */}
            <Link id="linkButton"
              to={{
                pathname: `${ROUTES.EDITOR}`,
                state: { }
              }}>Back</Link>

          </div>
        )}
      </div>
    );
  }
}


// export
//    details: exports the submissions details page
//    params: none
//    return: none
//
export default withFirebase(SubmissionItem);
