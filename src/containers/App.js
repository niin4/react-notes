import React, { Component } from 'react';
var ReactMarkdown = require('react-markdown');
import Moment from 'react-moment';

import Modal from '../components/Modal';

const apiEndPoint = 'http://localhost:5050/notes/';

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
      button: 'Edit',
      modal: false
    };

    this.updateNote = this.updateNote.bind(this);
    this.updateActive = this.updateActive.bind(this);
    this.editingNote = this.editingNote.bind(this);
    this.normalNote = this.normalNote.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.editNoteHeader = this.editNoteHeader.bind(this);
    this.editNoteText = this.editNoteText.bind(this);
    this.updateList = this.updateList.bind(this);
    this.addNewNote = this.addNewNote.bind(this);
    this.saveNewNote = this.saveNewNote.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.getNote = this.getNote.bind(this);
  }
  componentDidMount() {
    this.notesList();
  }

  toggleEditing() {
    this.setState({editing: !this.state.editing});
    if (this.state.editing) {
      this.setState({button: 'Edit'});
      setHeight();
      if (this.state.active.notes_id) {
        this.updateNote();
      } else {
        this.saveNewNote();
      }
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
          : <p></p>}
      </div>
    )
  }

  editingNote() {
    return ( 
      <div className="note__container">    
        <textarea wrap="soft" rows="1" className="note__edit-header" defaultValue={this.state.active.notes_name} onChange={this.editNoteHeader}></textarea>
          <h4 className="note__date"><Moment format="Do MMMM YYYY" date={this.state.active.notes_date}/></h4>
          <textarea id="noteText" className="note__edit-text" value={this.state.active.notes_text} onKeyUp={auto_grow} onChange={this.editNoteText} ></textarea>
      </div>
    )
  }

  updateNote(){
    fetch(apiEndPoint+'edit/'+this.state.active.notes_id, {
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

  saveNewNote(){
    fetch(apiEndPoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: this.state.active.notes_user,
        name: this.state.active.notes_name,
        text: this.state.active.notes_text
      })
      })
    .then(response => {
      return response.json();
    }).then(result => {
      console.log(result);
      if (result[0].result == 'success') {
        this.updateList();
        this.getNote(result[0].InsertId);
      }
    });      
  }

  // TODO: Update user id
  addNewNote() {
    this.setState({
      active: {
        notes_name: '',
        notes_text: '',
        notes_user: 1
      },
      editing: true,
      button: 'Save'
    })
  }

  updateList() {
    fetch(apiEndPoint+'1/')
    .then((response) => {
      return response.json();
    }).then(data => {        
      this.setState({notes:data[0].data});
   }) 
  }

  getNote(id) {
    fetch(apiEndPoint+'note/'+id)
    .then((response) => {
      return response.json();
    }).then(data => {        
      console.log(data);
      this.setState({active:data[0].data[0]});
   }) 
  }

  notesList() {
    fetch(apiEndPoint+'1/')
      .then((response) => {
        return response.json();
      }).then(data => {        
        this.setState({notes:data[0].data});
        this.updateActive(this.state.notes[0]);
     }) 
  }

  deleteNote() {
  fetch(apiEndPoint+'delete/'+this.state.active.notes_id, {
    method: 'Delete'})    
    .then((response) => {
      return response.json();
      console.log(response.json());
    }).then(() => {        
      this.notesList();
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
  toggleModal() {
    this.setState({modal: !this.state.modal})
  }

  confirmDelete() {
    this.setState({modal: !this.state.modal})
    console.log('delete note id '+this.state.active.notes_id);
    this.deleteNote();
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
         <button className="button--fancy" onClick={this.addNewNote}>Add new</button>
        </div>
        { this.state.active ?
        <div className="note">
          {this.state.editing ?
            this.editingNote() : this.normalNote()
          }
          <button id="editButton" className={this.state.editing? 'button--fancy--active':'button--fancy'} onClick={this.toggleEditing}>{this.state.button}</button>
          <button id="deleteButton" className="button--fancy" onClick={this.toggleModal}>Delete</button>
        </div>
        : <p>Loading...</p>
        }
        <Modal shown={this.state.modal} onClose={this.toggleModal} confirmDelete={this.confirmDelete}/>
      </div>
    );
  }
}

export default App;
