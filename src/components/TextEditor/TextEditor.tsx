import React from 'react';
import RichTextEditor from 'react-rte';
import { TextEditorProps, TextEditorState } from '../../types/index';
import { EditorValue } from "react-rte";

export default class TextEditor extends React.Component<TextEditorProps, TextEditorState> {
  state = {
    value: RichTextEditor.createValueFromString(this.props.value, 'html')
  }

  onChange = (value: EditorValue) => {
    this.setState({value});
    // Send the changes up to the parent component as an HTML string.
    // This is here to demonstrate using `.toString()` but in a real app it
    // would be better to avoid generating a string on each change.
    this.props.onChange(
      value.toString('html')
    );
  };

  render () {
    return (
      <RichTextEditor
        value={this.state.value}
        onChange={this.onChange}
      />
    );
  }
}