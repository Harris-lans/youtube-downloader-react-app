import './App.css';
import React from 'react';
import ListSelect from './ListSelect.js'
import { TextField } from '@material-ui/core';

export default class App extends React.Component
{
  constructor(props)
  {
    super(props);

    // Setting initial state
    this.state = {
      url : "",
      selectedQuality : "",
      selectedFormat : "" 
    };
  }

  handleOnURLChanged(event)
  {
    const url = event.target.value;
    this.setState({ url });
  }

  handleOnQualitySelected(value)
  {
    const selectedQuality = value;
    this.setState({ selectedQuality });
  }

  handleOnFormatSelected(value)
  {
    const selectedFormat = value;
    this.setState({ selectedFormat });
  }

  render()
  {
    return (

        <div className="background">
          <header className="app-title">
            Youtube Downloader
          </header>
          <TextField label="URL" variant="standard" type="string" inputProps={{color:'white'}} onChange={this.handleOnURLChanged.bind(this)}/>
          <ListSelect title="Quality" options={[10, 20, 30]} onChange={this.handleOnQualitySelected.bind(this)}/>
          <ListSelect title="Format" options={["mp4", "mov"]} onChange={this.handleOnFormatSelected.bind(this)}/>
        </div>
    
    );
  }
}
