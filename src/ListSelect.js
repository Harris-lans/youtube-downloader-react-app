import './ListSelect.css';
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

export default class ListSelect extends React.Component
{
    render()
    {
        let optionsList = this.props.options.map((value, index)=> {

            return <MenuItem value={value}>{value}</MenuItem>;
        
        });

        return (

            <FormControl className="form-control">
                <InputLabel>{this.props.title}</InputLabel>
                <Select variant="standard" onChange={console.log("Selected")}>
                    {optionsList}
                </Select>
            </FormControl>

        );
    }
}