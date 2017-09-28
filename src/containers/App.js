import React, { Component } from 'react';
var ReactMarkdown = require('react-markdown');
import Moment from 'react-moment';

function setHeight() {
  document.getElementById('noteText').style.height = "5px";
  document.getElementById('noteText').style.height = (document.getElementById('noteText').scrollHeight)+"px";
}

function auto_grow() {
  document.getElementById('noteText').style.height = (document.getElementById('noteText').scrollHeight)+"px";
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    notes:[],
      active: {},
      editing: false,
      button: 'Edit'
    };

    this.updateNote = this.updateNote.bind(this);
    this.updateActive = this.updateActive.bind(this);
    this.editingNote = this.editingNote.bind(this);
    this.normalNote = this.normalNote.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.editNoteHeader = this.editNoteHeader.bind(this);
    this.editNoteText = this.editNoteText.bind(this);
    this.updateList = this.updateList.bind(this);
  }
  componentDidMount() {
    this.notesList();
  }

  toggleEditing() {
    this.setState({editing: !this.state.editing});
    if (this.state.editing) {
      this.setState({button: 'Edit'});
      setHeight();
      this.updateNote();
    } else {
      this.setState({button: 'Save'});
    }
  }
  //https://stackoverflow.com/a/43639228
  editNoteHeader(event) {
    let active = Object.assign({}, this.state.active);  
    active.notes_name = event.target.value;                        
    this.setState({active});
  }
  editNoteText(event) {
    let active = Object.assign({}, this.state.active);  
    active.notes_text = event.target.value;                        
    this.setState({active});
  }

  normalNote() {
    return ( 
      <div className="note__container">    
        <h1>{this.state.active.notes_name}</h1>
          <h4 className="note__date"><Moment format="Do MMMM YYYY" date={this.state.active.notes_date}/></h4>
          {this.state.active.notes_text ?
          <div className="note__content">
          <ReactMarkdown source={this.state.active.notes_text}></ReactMarkdown>
          </div>
          : <p>Loading...</p>}
      </div>
    )
  }

  editingNote() {
    return ( 
      <div className="note__container">    
        <textarea wrap="soft" rows="1" className="note__edit-header" defaultValue={this.state.active.notes_name} onChange={this.editNoteHeader}></textarea>
          <h4 className="note__date"><Moment format="Do MMMM YYYY" date={this.state.active.notes_date}/></h4>
          <textarea id="noteText" className="note__edit-text" value={this.state.active.notes_text} onChange={this.editNoteText} ></textarea>
      </div>
    )
  }

  updateNote(){
    fetch('http://localhost:5000/notes/edit/'+this.state.active.notes_id, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.active.notes_name,
        text: this.state.active.notes_text
      })
      })
    .then(response => {
      return response.json();
    }).then(result => {
      if (result[0].result = 'success') {
        this.updateList();
      }
    });      
  }

  updateList() {
    fetch('http://localhost:5000/notes/1/')
    .then((response) => {
      return response.json();
    }).then(data => {        
      this.setState({notes:data[0].data});
   }) 
  }

  notesList() {
    fetch('http://localhost:5000/notes/1/')
      .then((response) => {
        return response.json();
      }).then(data => {        
        this.setState({notes:data[0].data});
        this.updateActive(this.state.notes[0]);
     }) 
  }

  updateActive(e) {
    this.setState({active:e, editing: false});
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.editing !== this.state.editing && this.state.editing) {
      setHeight();
    }
  }

  render() {
    return (
      <div className="container">
        <div className="note-list">
          <h2>Notes</h2>
          <ul>        
          {this.state.notes.length ?
          	this.state.notes.map(item=><li key={item.notes_id} onClick={() => this.updateActive(item)}>
              {item.notes_name} <span className="note-list__date"><Moment format="DD.MM.YYYY" date={item.notes_date}></Moment></span>
              </li>) 
            : <li>Loading...</li>
          }
         </ul>
        </div>
        { this.state.active ?
        <div className="note">
          {this.state.editing ?
            this.editingNote() : this.normalNote()
          }
          <button id="editButton" className={this.state.editing? 'button--fancy--active':'button--fancy'} onClick={this.toggleEditing}>{this.state.button}</button>
          <button id="deleteButton" className="button--fancy">Delete</button>
        </div>
        : <p>Loading...</p>
        }
      </div>
    );
  }
}

export default App;
