import './ListSelect.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';

export default class ListSelect extends React.Component
{
    constructor(props)
    {
        super(props);
        
        // Setting initial state
        this.state = { 
            selectedValue : "",
            active : false
        };
    }

    handleOnSelect(eventKey, event)
    {
        const selectedValue = eventKey;
        this.setState({ selectedValue });

        // Invoking onChange callback
        this.props.onSelect(selectedValue);
    }

    tryFillingInInitialValue()
    {
        let noOptionsSelected = true;
        this.props.options.forEach(element => {

            let isOptionSelected = (element.localeCompare(this.state.selectedValue) === 0);
            noOptionsSelected = noOptionsSelected && !isOptionSelected;

        });

        if (noOptionsSelected && this.props.options.length > 0)
        {
            this.handleOnSelect(this.props.options[0]);
        }
    }

    componentDidMount()
    {
        this.tryFillingInInitialValue();
    }

    componentDidUpdate()
    {
        this.tryFillingInInitialValue();
    }

    render()
    {
        // Generating options
        const options = this.props.options.map((value, index)=> {

            let isOptionSelected = (value.localeCompare(this.state.selectedValue) === 0);
            return <Dropdown.Item className="dropdown-item" active={isOptionSelected} key={index.toString()} eventKey={value} onSelect={this.handleOnSelect.bind(this)}>{value}</Dropdown.Item>;
        
        });

        // Handling loading condition
        let selectedOption;
        
        if (this.props.loading)
        {
            selectedOption = <Spinner animation="border" size="sm" variant="light"/>;
        }
        else
        {
            selectedOption = this.state.selectedValue;
        }

        return (

            <div className="list-select dropdown-container">
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>{this.props.title}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Dropdown as={InputGroup.Append}>
                        <Button>
                            {selectedOption}
                        </Button>
                        <Dropdown.Toggle split/>
                        <Dropdown.Menu>
                            {options}
                        </Dropdown.Menu>
                    </Dropdown>
                </InputGroup>
            </div>

        );
    }
}