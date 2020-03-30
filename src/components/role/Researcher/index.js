import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../../Session';
import { SubmissionRequestForm } from '../../Submission';
import * as ROLES from '../../../constants/roles';
import * as ROUTES from '../../../constants/routes';

import './res.css';

const ResearcherPage = () => (
  <div>
    <h1 className="researcher"> Researcher </h1>
    <Route exact path={ROUTES.RESEARCHER} component={SubmissionRequestForm} />
  </div>

);

/*
class ResearcherPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdf: null,
      url: "",
      progress: 0,
      user: ""
    }
  }

  handleChange = e => {
    if (e.target.files[0]) {
      const pdf = e.target.files[0];
      this.setState(() => ({ pdf }));
    }
  };

  handleUpload = () => {
    const { pdf } = this.state;
    const filename = pdf.name;
    const storageRef = firebase.storage().ref('/pdf/' + filename);
    const uploadTask = storageRef.put(pdf);

    uploadTask.on(
      "state_changed",
      snapshot => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      error => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...
        firebase.storage().ref("pdf/").child(pdf.name).getDownloadURL().then(url => {
            this.setState({ url });
            var postKey = firebase.database().ref('Submissions').push().key;
            var user = firebase.auth().currentUser.uid;
            var updates = {};
            var postData = {
              downloadURL: url,
              user: firebase.auth().currentUser.uid
            };
            updates['/Submissions/' + postKey] = postData;
            firebase.database().ref().update(updates);
          });
      },
    );
  };
  handleDownload = () => {
    window.open(this.state.url);
  }

  render() {
    return (
      <div>
        <h1 className="researcher">Researcher</h1>
        <div className="center">
            <br/>
            <h2 className="green-text">Journal Submissions</h2>
            <br/>
            <br/>
          <div className="row">
            <progress value={this.state.progress} max="100" className="progress" />
          </div>
          <br/>
          <div className="file-field input-field">
            <div className="btn">
              <span>Choose a PDF</span>
              <input type="file" accept="application/pdf" onChange={this.handleChange} />
            </div>
            <div className="file-path-wrapper">
            </div>
          </div>
          <button
            onClick={this.handleUpload}
            className="waves-effect waves-light btn"
          >
            Upload
          </button>
          <button
            onClick={this.handleDownload}
            className="waves-effect waves-light btn"
          >
            Download
          </button>
        </div>
      </div>
    );
  }
}
*/
const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(ResearcherPage);
