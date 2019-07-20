import React from 'react';
import { Item } from '../../types/index';
import './ReadonlyNote.css';

interface ReadonlyNoteProps {
    item: Item;
}

export default class ReadonlyNote extends React.Component<ReadonlyNoteProps, {}> {
    render(){
        var item = this.props.item;
        return (
            <div id="ReadonlyNote">
                <h2 className="title">{item.title}</h2>
                <div className="text" dangerouslySetInnerHTML={ {__html: item.text} }></div>
            </div>
        );
    }
}