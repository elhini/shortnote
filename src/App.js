import React from 'react';
import './App.css';
import ls from './utils/LocalStorage';
import Form from './components/Form/Form';
import List from './components/List/List';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ls.get(),
      item: {id: 0, title: '', text: ''}
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
  }

  onSubmit(e){
    var form = e.target;
    var idFromForm = parseInt(form.id.value);
    var id = idFromForm || Date.now();
    var newItem = {id: id, title: form.title.value, text: form.text.value};
    var items = this.state.items;
    if (idFromForm){
      items = items.filter(i => i.id !== idFromForm);
    }
    items.push(newItem);
    items.sort((a, b) => a.id - b.id);
    ls.set(items);
    this.setState({items: items});
    e.preventDefault();
  }

  onEditItem(item){
    this.setState({item: item});
  }

  render(){
    return (
      <div id="App">
        <Form item={this.state.item} onSubmit={this.onSubmit}></Form>
        <List items={this.state.items} onEditItem={this.onEditItem}></List>
      </div>
    );
  }
}
