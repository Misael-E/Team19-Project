import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import Firebase, { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import './sub.css';


const INITIAL_STATE = {
  author: '',
  deadline: 0,
  title: '',
  user: null,
  firstName: '',
  lastName: '',
  loading: false,
  userID: '',
  downloadURL: "",
  progress: 0,
};

class SubmissionRequestForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { deadline, title } = this.state;
    this.props.firebase.submission(this.props.match.params.id).push({
      deadline,
      title,
    })
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChange = e => {
    if (e.target.files[0]) {
      const pdf = e.target.files[0];
      this.setState(() => ({ pdf }));
    }
  };

  handleUpload = () => {
    const { pdf } = this.state;
    const filename = pdf.name;
    const storageRef = this.props.firebase.storage.ref(`pdf/${filename}`);
    const uploadTask = storageRef.put(pdf);


    uploadTask.on(
      'state_changed',
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
        this.props.firebase.storagePdf().child(filename).getDownloadURL().then(url => {
            this.setState({ url });
            var userID = this.props.firebase.auth.currentUser.uid;
            var downloadURL = url;
            this.props.firebase.submissions().push({
              userID,
              downloadURL,
            });
          });
      }
    );
  };
  handleDownload = () => {
    window.open(this.state.url);
  }

  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.firebase
        .user(authUser.uid)
        .on('value', snapshot => {
          this.setState({
            user: snapshot.val(),
            loading: false,
          });
        });
      } else {
        console.log("error");
      }
    })
  }

  componentWillUnmount() {
    this.props.firebase.user().off();
  }

  render() {

    const { user,
            loading,
            title,
            downloadURL,
            deadline, } = this.state;


    return (
      <div>

        {user && (
        <div className="center">
            <br/>
            <h2 className="green-text">Journal Submissions</h2>
            <br/>
            <br/>
            <span> Author: {user.firstName} {user.lastName} </span>
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
            <form onSubmit={this.onSubmit}>
              <button className="btn"  type="submit">
                  Submit Request
                </button>
            </form>

        </div>
      )}
      </div>
    );
  }

}

export default withFirebase(SubmissionRequestForm);
