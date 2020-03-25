import './ListSelect.css';
import React from 'react';

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
        // const optionsList = this.props.options.map((value, index)=> {

        //     return <MenuItem key={index.toString()} value={value}>{value}</MenuItem>;
        
        // });

        return (

            <div></div>

        );
    }
}