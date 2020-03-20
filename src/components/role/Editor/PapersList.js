import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';
import './papersList.css';

class PapersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      papers: []
    };
  };

  componentDidMount(){

    this.props.firebase.papers().on('value', snapshot => {
      if (snapshot.exists()) {
        const papersObject = snapshot.val();

        const papersList = Object.keys(papersObject).map(key => ({
          ...papersObject[key],
          paperID: key,
        }));


      console.log(Object.keys(papersObject));
      console.log(papersList);

        this.setState({
          papers: papersList,
        });
      };
    });


  

    // var newPostKey = this.props.firebase.emptyRef().child('papers').push().key;

    // var deadlineDate = new Date(2020, 11, 1, 23, 59);

    // var postData = {
    //   author: 'author1',
    //   title: 'title111',
    //   deadline: deadlineDate.getTime()
    // };
  

    // var updates = {};
    // updates['/papers/' + newPostKey] = postData;
    // // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  
    // return this.props.firebase.emptyRef().update(updates);
  
    // //   this.props.firebase.papers().update({
    // //     paperID: 'myPaperID',

    // //     author: 'myAuthor',
    // //     title : 'myTitle'
    // // });
    
    // }


  }

  componentWillUnmount() {
    this.props.firebase.papers().off();
  }

  render(){
    // const papers  = this.state;
    return(
      <div>
        <table>
              <tr>
                <th>Paper</th>
                <th>Author</th>
                <th>Deadline</th>
                <th></th>
              </tr>
          {this.state.papers.map(paper => (
              <tr key={paper.paperID}>
                <td>{paper.title}</td>
                <td>{paper.author}</td>
                <td>{(new Date(paper.deadline)).toString()}</td>
                <td>
                    <Link
                      to={{
                        pathname: `${ROUTES.EDITOR}/${paper.paperID}`,
                        state: { paper },
                      }}
                    >
                      View/Edit
                    </Link>
                </td>
              </tr>
            // <li key={paper.paperID}>
            //   {/* <span>
            //     <strong>Paper:</strong> {paper.title}
            //   </span>
            //   <span>
            //     <strong>Authors:</strong> {paper.author}
            //   </span>
            //   <span>
            //     <strong>Deadline:</strong> {
            //       (new Date(paper.deadline)).toString()
            //     }
            //   </span>
            // </li> */}
          ))}
        </table>

      </div>
    )
  }
}

export default withFirebase(PapersList);
