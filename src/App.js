import React from 'react';
import './App.css';
import ls from './utils/LocalStorage';
import Form from './components/Form/Form';
import List from './components/List/List';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    var items = ls.get();
    var emptyItem = this.buildEmptyItem();
    items.unshift(emptyItem);
    this.state = {
      items: items
    };
    this.onOpenNew = this.onOpenNew.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onOpenItem = this.onOpenItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
  }

  findEmptyItem(){
    return this.state.items.find(i => i.id === 0);
  }

  buildEmptyItem(){
    return {id: 0, title: '', text: '', opened: true};
  }

  onOpenNew(){
    var items = this.state.items;
    var emptyItem = this.findEmptyItem();
    if (!emptyItem){
      emptyItem = this.buildEmptyItem();
      items.unshift(emptyItem);
    }
    items.forEach(i => i.opened = i.id === 0);
    this.setState({items: items});
  }

  onSubmit(e){
    var form = e.target;
    var idFromForm = parseInt(form.id.value);
    var id = idFromForm || Date.now();
    var itemFromForm = {id: id, title: form.title.value, text: form.text.value, opened: true};
    var items = this.state.items;
    if (idFromForm){
      items = items.filter(i => i.id !== idFromForm);
    }
    else {
      this.findEmptyItem().opened = false;
    }
    items.push(itemFromForm);
    items.sort((a, b) => a.id - b.id);
    this.saveToStore(items);
    this.setState({items: items});
    e.preventDefault();
  }

  saveToStore(items){
    ls.set(items.filter(i => i.id > 0));
  }

  onOpenItem(item){
    var items = this.state.items;
    items.forEach(i => i.opened = i.id === item.id);
    this.setState({items: items});
  }

  onDeleteItem(item){
    var items = this.state.items;
    if (item.opened){
      this.findEmptyItem().opened = true;
    }
    items = items.filter(i => i.id !== item.id);
    this.saveToStore(items);
    this.setState({items: items});
  }

  render(){
    var openedItem = this.state.items.find(i => i.opened);
    return (
      <div id="App">
        <h1>ShortNote</h1>
        <button id="openNew" onClick={this.onOpenNew}>Open new</button>
        <Form item={openedItem} onSubmit={this.onSubmit}></Form>
        <h2>List</h2>
        <List items={this.state.items} onOpenItem={this.onOpenItem} onDeleteItem={this.onDeleteItem}></List>
      </div>
    );
  }
}
