import React from 'react';
import { Link } from "react-router-dom";
import './App.css';
import NotesApiClient from '../../api-clients/notes';
import StringUtils from '../../utils/StringUtils';
import Filters from '../../components/Filters/Filters';
import Sort from '../../components/Sort/Sort';
import Form from '../../components/Form/Form';
import List from '../../components/List/List';
import DateUtils from '../../utils/DateUtils';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    var id = props.match.params.id;
    var item = id === 'new' ? this.buildEmptyItem() : null;
    this.state = {
      item: item,
      items: [],
      filters: {},
      sort: {field: 'dateOfUpdate', direction: 'desc'}
    };
    this.tags = [];
    this.history = props.history;
    this.stopListeningHistory = this.history.listen(location => {
      var item = this.getItemByLocation();
      this.setState({item: item});
    });
    this.notesAPIClient = new NotesApiClient();
    this.onOpenNew = this.onOpenNew.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onCreateTag = this.onCreateTag.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
  }

  getItemByLocation(items = this.state.items){
    var id = window.location.pathname.split('note/')[1];
    var item = id === 'new' ? this.buildEmptyItem() : items.find(i => i._id === id);
    return item;
  }

  componentDidMount() {
    this.setState({loadingList: true});
    this.notesAPIClient.getAll(items => {
      var item = this.getItemByLocation(items);
      this.setState({items: items, loadingList: false, item: item});
    });
  }

  componentWillUnmount() {
    this.stopListeningHistory();
  }

  buildEmptyItem(){
    return {_id: '', title: '', text: '', tags: []};
  }

  onOpenNew(){
    var emptyItem = this.buildEmptyItem();
    this.setState({item: emptyItem});
  }

  onSubmit(e, item = this.state.item){
    e && e.preventDefault();
    if (!item.title && !item.text){
      return;
    }
    if (!item._id){
      item.dateOfCreate = new Date();
    }
    item.dateOfUpdate = new Date();
    this.setState({sendingForm: true});
    if (item._id){
      this.updateItem(item, i => this.onItemChange(i, false));
    }
    else {
      this.createItem(item, i => this.onItemChange(i, true));
    }
  }

  createItem(item, cb){
    this.notesAPIClient.create(item, cb);
  }

  updateItem(item, cb){
    this.notesAPIClient.update(item, cb);
  }

  // TODO: move to Utils
  isObjectsEqual(obj1, obj2){
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  isItemsDiffer(item1, item2){
    return item1.title !== item2.title || 
           item1.text !== item2.text || 
           !this.isObjectsEqual(item1.tags, item2.tags);
  }

  onItemChange(item, isNew){
    item = Object.assign({}, this.state.item, item);
    var isChanged = this.isItemsDiffer(item, this.state.item);
    var items = this.state.items;
    if (!isNew){
      items = items.filter(i => i._id !== item._id); // remove old version
    }
    items.push(item);
    this.setState({items: items, item: item, sendingForm: false, formChanged: isChanged});
    isNew && this.history.push('/note/' + item._id);
    if (isChanged && !this.state.sendingForm){
      clearTimeout(this.autosaveInterval);
      this.autosaveInterval = setTimeout(() => {
        this.onSubmit(null, item);
      }, 1000);
    }
  }

  onDeleteItem(item){
    var items = this.state.items;
    items = items.filter(i => i._id !== item._id);
    this.notesAPIClient.remove(item, res => {
      var openedItem = this.state.item && this.state.item._id === item._id ? null : this.state.item;
      this.setState({items: items, item: openedItem});
      this.history.push('/');
    });
  }

  onFiltersChange(filters){
    filters = Object.assign({}, this.state.filters, filters);
    this.setState({filters: filters});
  }

  onSortChange(sort){
    sort = Object.assign({}, this.state.sort, sort);
    this.setState({sort: sort});
  }

  filter(items){
    return items.filter(i => {
      // text
      var text = this.state.filters.text;
      var useTextFilter = !!text;
      var matchByText = useTextFilter ? StringUtils.isContains(i.text, text) || StringUtils.isContains(i.title, text) : true;
      // tags
      var tags = this.state.filters.tags;
      var filterTagIDs = tags ? tags.map(t => t.value) : [];
      var itemTagIDs = i.tags ? i.tags.map(t => t.value) : [];
      var useTagsFilter = tags && !!tags.length;
      var matchByTags = useTagsFilter ? itemTagIDs.some(itemTagID => filterTagIDs.includes(itemTagID)) : true;
      // match
      var useFilters = useTextFilter || useTagsFilter;
      return useFilters && i._id 
        ? (
          (useTextFilter ? matchByText : true) && 
          (useTagsFilter ? matchByTags : true)
        )
        : true;
    });
  }

  sort(items){
    var field = this.state.sort.field;
    var sign = this.state.sort.direction === 'asc' ? 1 : -1;
    return items.sort((i1, i2) => {
      var v1 = i1[field];
      var v2 = i2[field];
      if (field.includes('date')){
        v1 = DateUtils.toStr(v1);
        v2 = DateUtils.toStr(v2);
      }
      return v1 > v2 ? sign : (v1 < v2 ? -sign : 0);
    })
  }

  // TODO: load from DB
  buildTagList(){
    return this.state.items.reduce((tags, item) => tags.concat(item.tags || []), []);
  }

  onCreateTag(tagName) {
    var maxID = Math.max.apply(Math, this.tags.map(t => t.value));
    var newID = maxID < 0 ? 1 : maxID + 1;
    var tag = { value: newID, label: tagName };
    this.tags.push(tag);
    var item = {};
    item.tags = this.state.item ? this.state.item.tags.slice() : [];
    item.tags.push(tag);
    this.onItemChange(item);
  }

  render(){
    return (
      <div id="App">
        <div id="head">
          <h1>
            ShortNote
            <Link to={'/note/new'} id="openNew" onClick={this.onOpenNew}>Open new</Link>
          </h1>
        </div>
        {this.renderBody()}
      </div>
    );
  }

  filterAndSortItems(items){
    var filteredItems = this.filter(items);
    var sortedItems = this.sort(filteredItems);
    return sortedItems;
  }

  renderBody(){
    var items = this.filterAndSortItems(this.state.items);
    this.tags = this.buildTagList();

    var form = null;
    var item = this.state.item;
    if (item){
      form = <Form item={item} onSubmit={this.onSubmit} tags={this.tags} onCreateTag={this.onCreateTag} onItemChange={this.onItemChange} 
        sending={this.state.sendingForm} changed={this.state.formChanged}></Form>;
    }

    return (
      <div id="body">
        <div id="aside">
          <div id="filtersAndSortCont">
            <div id="filtersCont">
              <Filters filters={this.state.filters} onFiltersChange={this.onFiltersChange} tags={this.tags}></Filters>
            </div>
            <div id="sortCont">
              <Sort sort={this.state.sort} onSortChange={this.onSortChange}></Sort>
            </div>
          </div>
          <div id="listCont">
            <List items={items} item={item} onDeleteItem={this.onDeleteItem} loading={this.state.loadingList}></List>
          </div>
        </div>
        <div id="formCont">
          {form}
        </div>
      </div>
    );
  }
}
