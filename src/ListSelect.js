import './ListSelect.css';
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

export default class ListSelect extends React.Component
{
    constructor(props)
    {
        super(props);
        
        // Setting initial state
        this.state = { 
            value : ""
        };
    }

    handleOnChange(event)
    {
        const value = event.target.value;
        this.setState({ value });

        // Invoking onChange callback
        this.props.onChange(value);
    }

    render()
    {
        const optionsList = this.props.options.map((value, index)=> {

            return <MenuItem key={index.toString()} value={value}>{value}</MenuItem>;
        
        });

        return (

            <FormControl className="form-control">
                <InputLabel>{this.props.title}</InputLabel>
                <Select value={this.state.value} variant="standard" onChange={(this.handleOnChange.bind(this))}>
                    {optionsList}
                </Select>
            </FormControl>

        );
    }
}