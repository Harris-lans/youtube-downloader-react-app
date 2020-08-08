import './style.css';
import React from 'react';
import Form from 'react-bootstrap/Form';

export class TextField extends React.Component
{
    constructor(props)
    {
        super(props);

        // Setting initial state
        this.state = {
            value : ""
        };
    }

    handleOnTextChanged(event)
    {
        const value = event.target.value;
        this.setState({ value });

        // Invoking onChange callback
        this.props.onChange(value);
    }

    render()
    {
        return (
            <Form.Group className="text-field-container">
                <Form.Label className="text-field-label">{this.props.label}</Form.Label>
                <Form.Control className="text-field-input" inputMode={this.props.inputMode} onChange={this.handleOnTextChanged.bind(this)}></Form.Control>
                <Form.Text className="text-field-sub-text">{this.props.subText}</Form.Text>
            </Form.Group>
        );
    }
}
