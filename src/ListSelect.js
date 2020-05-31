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
            selectedID : -1,
            active : false
        };
    }

    handleOnSelect(eventKey, event)
    {
        const selectedID = eventKey;
        this.setState({ selectedID });
        const selectedValue = this.props.options.find(element => element.id == selectedID)?.value;
       
        // Invoking onChange callback
        this.props.onSelect(selectedID, selectedValue);
    }

    tryFillingInInitialValue()
    {
        // Checking 
        let noOptionsSelected = this.props.options.find(element => element.id == this.state.selectedID) == null;
        
        // Selecting first option if no options are selected
        if (noOptionsSelected && this.props.options.length > 0)
        {
            this.handleOnSelect(this.props.options[0].id);
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
        const options = this.props.options.map((element)=> {

            let isOptionSelected = element.id === this.state.selectedID;
            return <Dropdown.Item className="dropdown-item" active={isOptionSelected} key={element.id} eventKey={element.id} onSelect={this.handleOnSelect.bind(this)}>{element.value}</Dropdown.Item>;
        
        });

        // Handling loading condition
        let selectedOption;
        
        if (this.props.loading)
        {
            selectedOption = <Spinner animation="border" size="sm" variant="light"/>;
        }
        else
        {
            selectedOption = this.props.options.find(element => element.id == this.state.selectedID)?.value;
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