import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';

import 'codemirror/lib/codemirror.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      apiKey: 'AIzaSyCEXKd9eHDV6iYjwYMVXK8V9_-cXn3ZG-U',
      authDomain: 'first-flight-with-friend-3ae54.firebaseapp.com',
      databaseURL: 'https://first-flight-with-friend-3ae54.firebaseio.com',
      projectId: 'first-flight-with-friend-3ae54',
      storageBucket: 'first-flight-with-friend-3ae54.appspot.com',
      messagingSenderId: '131545015019',
      data: 'Kindling the logs...',
      mounted: false,
      refPath: '',
      refValue: '',
      loading: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateData = this.updateData.bind(this);
    this.removeData = this.removeData.bind(this);
    this.pushData = this.pushData.bind(this);
    
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  updateData(e) {
    e.preventDefault();
    console.log('update');
  
    const dbRef = firebase.database().ref(this.state.refPath);
    dbRef.set(this.state.refValue);
  }

  pushData(e) {
    e.preventDefault();
    const dbRef = firebase.database().ref(this.state.refPath);
    dbRef.push(this.state.refValue);    
  }

  removeData(e) {
    console.log('remove');
    e.preventDefault();
    const dbRef = firebase.database().ref(this.state.refPath);
    dbRef.remove();
  }

  clearAll(e) {
    e.preventDefault();
    console.log('clearall');
    const dbRef = firebase.database().ref('/');
    dbRef.remove();
  }

  getSnapshot() {
    firebase.database().ref().on('value', (snapshot) => {
      this.setState({
        data: snapshot,
        loading: false
      })
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId } = this.state;

    const config = {
      apiKey,
      authDomain,
      databaseURL,
      projectId,
      storageBucket,
      messagingSenderId
    }
    this.setState({
      mounted: true,
      loading: true
    });
    firebase.initializeApp(config);
    this.getSnapshot();

  }

  showForm() {
    const buttonText = () => {
      if (this.state.loading) {
        return 'Connecting...'
      } else if (!this.state.mounted) {
        return 'Connect to Firebase'
      } else {
        return 'Connected'
      }
    }

    const stepOne = (
    <form onSubmit={this.handleSubmit}>
      <input type='text' value={this.state.apiKey} onChange={this.handleChange} name='apiKey' placeholder='api key'/>
      <input type='text' value={this.state.authDomain} onChange={this.handleChange} name='authDomain' placeholder='auth domain'/>
      <input type='text' value={this.state.databaseURL} onChange={this.handleChange} name='databaseURL' placeholder='database url'/>
      <input type='text' value={this.state.projectId} onChange={this.handleChange} name='projectId' placeholder='project id'/>
      <input type='text' value={this.state.storageBucket} onChange={this.handleChange} name='storageBucket' placeholder='storage bucket'/>
      <input type='text' value={this.state.messagingSenderId} onChange={this.handleChange} name='messagingSenderId' placeholder='messaging sender id'/>
      <button>{buttonText()}</button>
    </form>);

    const stepTwo = (
      <div className='step-wrapper step-2'>
        <form>
          <input type='text' name='refPath' onChange={this.handleChange} value={this.state.refPath} placeholder='ref path' />
          <input type='text' name='refValue' onChange={this.handleChange} value={this.state.refValue} placeholder='value' />
          <button onClick={this.updateData}>Add Data</button>
          <button onClick={this.pushData}>Push Data</button>          
          <button onClick={this.removeData}>Remove Data</button>
        </form>
        <pre>
          {JSON.stringify(this.state.data, null, 2)}
        </pre>
        <button onClick={this.clearAll} className='btn-clear'>Clear all nodes</button>
      </div>);

      if (!this.state.mounted) {
        return stepOne;
      } else {
        return stepTwo;
      }

  }
  showTitle() {
    if (this.state.loading === true) {
      return "Connecting to Fireplace...";
    } else if (this.state.mounted === false) {
      return "Connect to Fireplace";
    } else if (this.state.mounted === true) {
      return <div>Connected to: <span className='project-name'>{this.state.projectId}</span></div>;
    } else {
      return "Welcome to Fireplace";
    }
  }
  render() {
    return (
      <div className='App'>
        <div className='appbar'>
          <img src='fireplace.png' className='logo' />
          <h1>Fireplace</h1>
        </div>
        <div className='featurebar'>
          <h2>{this.showTitle()}</h2>
        </div>
       {this.showForm()}
      </div>
    );
  }
}

export default App;
