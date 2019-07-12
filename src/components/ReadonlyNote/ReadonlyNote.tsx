import React from 'react';
import { ReadonlyNoteProps } from '../../types/index';
import './ReadonlyNote.css';

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