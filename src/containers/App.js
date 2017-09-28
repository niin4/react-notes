import React, { Component } from 'react';

import Note from '../components/Note';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
     notes:[],
     active: {}
    };

    this.updateActive = this.updateActive.bind(this);
  }

  componentDidMount() {
    this.notesList();
  }

  notesList() {
    fetch('http://localhost:5000/notes/1/')
      .then((response) => {
        return response.json();
      }).then(data => {        
        this.setState({notes:data[0].data, active: data[0].data[0]});
        console.log(this.state.notes[0]);

     }) 
  }

  updateActive(e) {
    this.setState({active:e});
  }

  render() {
    return (
      <div className="container">
        <div className="note-list">
          <ul>        
          {this.state.notes.length ?
          	this.state.notes.map(item=><li key={item.notes_id} onClick={() => this.updateActive(item)}>{item.notes_name}</li>) 
            : <li>Loading...</li>
          }
         </ul>
        </div>
        <div className="note">
          <Note note={this.state.active}></Note>
        </div>
      </div>
    );
  }
}

export default App;
