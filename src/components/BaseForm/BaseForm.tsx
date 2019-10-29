import React from "react";
import './BaseForm.css';
import Button from '@material-ui/core/Button';

interface BaseFormField {
  label: string,
  type?: string,
  name: string,
  required?: boolean
}
export interface BaseFormFieldValues {
  [fieldName: string]: string
}
interface BaseFormProps {
  title: string,
  fields: BaseFormField[],
  submitText: string,
  submittingText: string,
  onSubmit: (form: BaseForm, values: BaseFormFieldValues) => void
}
interface BaseFormState {
  fieldValues: BaseFormFieldValues, 
  submitting: boolean, 
  error: string, 
  tooLong: boolean,
  isMounted: boolean
}

export class BaseForm extends React.Component<BaseFormProps, BaseFormState> {
    state: BaseFormState = { fieldValues: {}, submitting: false, error: '', tooLong: false, isMounted: false };
  
    onSubmit(e: React.MouseEvent) {
      e.preventDefault();
      for (var i = 0; i < this.props.fields.length; i++){
        var f = this.props.fields[i];
        var value = this.state.fieldValues[f.name];
        if (f.required && !value){
          return this.setState({ error: f.name + ' is empty' });
        }
      }
      setTimeout(() => {
        this.state.isMounted && this.setState({ tooLong: true });
      }, 2000);
      this.props.onSubmit(this, this.state.fieldValues);
    }

    componentDidMount() {
      this.setState({isMounted: true})
    }

    componentWillUnmount() {
      this.setState({isMounted: false});
    }

    onChange(field: BaseFormField, e: React.ChangeEvent<HTMLInputElement>) {
      var values = this.state.fieldValues;
      values[field.name] = e.target.value;
      this.setState({fieldValues: values});
    }
  
    render() {
      return (
        <form className="baseForm">
          <h2>{this.props.title}</h2>
          {this.props.fields.map(f => {
            var value = this.state.fieldValues[f.name];
            return (
              <div className="fieldBlock" key={f.name}>
                <label>{f.label}:</label>
                <input type={f.type || "text"} name={f.name} required={f.required} value={value || ''} onChange={e => this.onChange(f, e)} />
              </div>
            );
          })}
          <Button variant="outlined" type="submit" onClick={e => this.onSubmit(e)} disabled={this.state.submitting}>
            {this.state.submitting ? this.props.submittingText : this.props.submitText}
          </Button><br />
          {this.state.error && <div className="alert error">{this.state.error}</div>}
          {this.state.tooLong && <div className="alert info">The request takes longer than usual. Please wait...</div>}
        </form>
      );
    }
}