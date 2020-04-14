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

class SubmissionItem extends Component {
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


  handleChange = date => {
    this.setState({
      newDeadline: date
    });
  };

  handleStatus = status => {
    this.setState({
      newStatus: status.value
    });
  };

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

  saveEdit() {
   
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
    function(error) {
      if (error) {
        // The write failed...
        console.log('write failed');
      } else {
        // Data saved successfully!
        console.log('write success');
      }
    }
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


  componentWillUnmount() {
    this.props.firebase.submission(this.props.match.params.id).off();
  }


  render() {
    const { submission } = this.state;

    const options = [
      { value: 'accepted', label: 'Accept' },
      { value: 'rejected', label: 'Reject' },
      { value: 'in progress', label: 'Place In Progress' }
    ]

    return (
      <div id="outer">
        {submission && (
          <div id="info">
            <h2 id="headerCenter">{submission.title}</h2>
            <table>
              <tr>
                  <th>Submission Title: </th>
                  <td>{submission.title}</td>
              </tr>
              <tr>
                  <th>Deadline: </th>
                  <td>{(new Date(submission.deadline)).toString()}</td>
              </tr>
              <tr>
                  <th>Enter a new deadline: </th>
                  <td>{
                    <DatePicker
                    selected={this.state.newDeadline}
                    onChange={this.handleChange}
                  />
                  }</td>
              </tr>
              <tr>
                  <th>Download Paper: </th>
                  <td>{
                    <a id="downloadPDF" href={submission.downloadURL}>Download PDF</a>
                  }</td>
              </tr>
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

            <Link id="linkButton" onClick={this.saveEdit.bind(this)}>Save</Link>
            {this.state.savedChangesMsg}
            <Link id="linkButton"
              to={{
                pathname: `${ROUTES.EDITOR}`,
              }}
            >
              Back
            </Link>

          </div>
        )}
      </div>
    );
  }
}

export default withFirebase(SubmissionItem);
