import React from 'react';
import { Link } from "react-router-dom";
import './App.css';
import NotesApiClient from '../../api-clients/notes';
import StringUtils from '../../utils/StringUtils';
import Filters from '../../components/Filters/Filters';
import Sort from '../../components/Sort/Sort';
import Form from '../../components/Form/Form';
import List from '../../components/List/List';
import ReadonlyNote from '../../components/ReadonlyNote/ReadonlyNote';
import DateUtils from '../../utils/DateUtils';
import { AppProps, AppState, Item, ItemDiff, Tag, FiltersValueDiff, SortValueDiff } from '../../types/index';
import { RouteComponentProps } from "react-router-dom";

export default class App extends React.Component<AppProps, AppState> {
  tags: Tag[];
  accessLevels: {id: number, name: string}[];
  history: RouteComponentProps['history'];
  stopListeningHistory: () => void;
  notesAPIClient: NotesApiClient;
  autosaveTimeoutID: number;

  constructor(props: AppProps) {
    super(props);
    var id = props.match.params.id;
    var item = id === 'new' ? this.buildEmptyItem() : null;
    this.state = {
      item: item,
      items: [],
      filters: {text: '', tags: []},
      sort: {field: 'dateOfUpdate', direction: 'desc'},
      loadingList: false,
      formChanged: false,
      sendingForm: false,
      error: ''
    };
    this.tags = [];
    this.accessLevels = [{id: 1, name: 'viewing'}, {id: 2, name: 'editing'}];
    this.history = props.history;
    this.stopListeningHistory = this.history.listen(location => {
      this.getItemByLocation(this.state.items);
    });
    this.notesAPIClient = new NotesApiClient(this);
    this.autosaveTimeoutID = 0;
    this.onOpenNew = this.onOpenNew.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onCreateTag = this.onCreateTag.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
    this.onItemChangePartially = this.onItemChangePartially.bind(this);
  }
  
  getItemIDFromLocation(){
    return window.location.pathname.split('note/')[1];
  }
  
  getPublicItemIDFromLocation(){
    var id = this.getItemIDFromLocation() || '';
    return id.split('public/')[1];
  }

  isPublicItemLocation(){
    return !!this.getPublicItemIDFromLocation();
  }

  getItemByLocation(items: Item[]){
    var cb = (item: Item | undefined) => this.setState({items: items, loadingList: false, item: item});
    var id = this.getItemIDFromLocation();
    var item = id === 'new' ? this.buildEmptyItem() : items.find(i => i._id === id);
    if (id && id !== 'new' && !item){
      var publicID = this.getPublicItemIDFromLocation();
      if (publicID){
        this.notesAPIClient.getPublic(publicID, (item: Item) => {
          cb(item);
        });
      }
      else {
        this.setState({error: 'note with specified id not found'});
      }
    }
    cb(item);
  }

  componentDidMount() {
    if (this.isPublicItemLocation()){
      this.getItemByLocation([]);
      return;
    }
    this.setState({loadingList: true});
    this.notesAPIClient.getAll((items: Item[]) => {
      this.getItemByLocation(items);
    });
  }

  componentWillUnmount() {
    this.stopListeningHistory();
  }

  buildEmptyItem(): Item {
    return {_id: '', title: '', text: '', tags: [], dateOfCreate: new Date(), dateOfUpdate: new Date(), publicAccess: false};
  }

  onOpenNew(){
    var emptyItem = this.buildEmptyItem();
    this.setState({item: emptyItem});
  }

  onSubmit(e: Event | null, item = this.state.item){
    e && e.preventDefault();
    if (!item || (!item.title && !item.text)){
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

  createItem(item: Item, cb: (i: Item) => void){
    this.notesAPIClient.create(item, cb);
  }

  updateItem(item: Item, cb: (i: Item) => void){
    this.notesAPIClient.update(item, cb);
  }

  // TODO: move to Utils
  isObjectsEqual(obj1: any, obj2: any){
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  isItemsDiffer(item1: Item, item2: AppState['item']){
    if (!item2){
      return true;
    }
    return item1.title !== item2.title || 
           item1.text !== item2.text || 
           item1.publicAccess !== item2.publicAccess || 
           // item1.accessLevel !== item2.accessLevel || 
           !this.isObjectsEqual(item1.tags, item2.tags);
  }

  onItemChange(item: Item, isNew?: boolean){
    item = {...this.state.item, ...item};
    var isChanged = this.isItemsDiffer(item, this.state.item);
    var items = this.state.items;
    if (!isNew){
      items = items.filter(i => i._id !== item._id); // remove old version
    }
    items.push(item);
    this.setState({items: items, item: item, sendingForm: false, formChanged: isChanged});
    isNew && this.history.push('/note/' + item._id);
    if (isChanged && !this.state.sendingForm){
      window.clearTimeout(this.autosaveTimeoutID);
      this.autosaveTimeoutID = window.setTimeout(() => {
        this.onSubmit(null, item);
      }, 1000);
    }
  }

  onDeleteItem(item: Item){
    var items = this.state.items;
    items = items.filter(i => i._id !== item._id);
    this.notesAPIClient.remove(item, () => {
      var openedItem = this.state.item && this.state.item._id === item._id ? null : this.state.item;
      this.setState({items: items, item: openedItem});
      this.history.push('/');
    });
  }

  onFiltersChange(filters: FiltersValueDiff){
    let newFilters = {...this.state.filters, ...filters};
    this.setState({filters: newFilters});
  }

  onSortChange(sort: SortValueDiff){
    let newSort = {...this.state.sort, ...sort};
    this.setState({sort: newSort});
  }

  filter(items: Item[]){
    return items.filter(i => {
      // text
      var text = this.state.filters.text;
      var useTextFilter = !!text;
      var matchByText = useTextFilter ? StringUtils.isContains(i.text, text) || StringUtils.isContains(i.title, text) : true;
      // tags
      var tags = this.state.filters.tags;
      var filterTagIDs = tags ?   tags.map(t => t.value) : [];
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

  sort(items: Item[]){
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
    return this.state.items.reduce((tags: Tag[], item) => tags.concat(item.tags || []), []);
  }

  onCreateTag(tagName: string) {
    var maxID = Math.max.apply(Math, this.tags.map(t => t.value));
    var newID = maxID < 0 ? 1 : maxID + 1;
    var tag = { value: newID, label: tagName };
    this.tags.push(tag);
    var item: ItemDiff = {};
    item.tags = this.state.item ? this.state.item.tags.slice() : [];
    item.tags.push(tag);
    this.onItemChangePartially(item);
  }

  onItemChangePartially(item: ItemDiff) {
    this.onItemChange(item as Item);
  }

  render(){
    if (this.state.item && this.isPublicItemLocation()){
      return <ReadonlyNote item={this.state.item} />;
    }
    return (
      <div id="App">
        <div>
          <Link to={'/note/new'} id="openNew" onClick={this.onOpenNew}>Open new</Link>
          {this.state.error && <div className="alert error" id="notesError">{this.state.error}</div>}
        </div>
        {this.renderBody()}
      </div>
    );
  }

  filterAndSortItems(items: Item[]){
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
      form = <Form item={item} /* onSubmit={this.onSubmit} */ tags={this.tags} /* accessLevels={this.accessLevels} */
        onCreateTag={this.onCreateTag} onItemChange={this.onItemChangePartially} 
        sending={this.state.sendingForm} changed={this.state.formChanged}></Form>;
    }

    return (
      <div id="wrap">
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
