import './App.css';
import React from 'react';
import ListSelect from './ListSelect.js';
import TextField from './TextField.js';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  handleOnURLChanged(value)
  {
    const url = value;
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
        <header className="app-header">Youtube Downloader</header>
        <div className="app-body">
          <Card>
            <Card.Body>
              <TextField label="URL" subText="Enter the URL of the video you want to download" inputMode="url" onChange={this.handleOnURLChanged.bind(this)}/>
              <ListSelect title="Quality" options={[10, 20, 30]} onChange={this.handleOnQualitySelected.bind(this)}/>
              <ListSelect title="Format" options={["mp4", "mov"]} onChange={this.handleOnFormatSelected.bind(this)}/>
            </Card.Body>
          </Card>
        </div>
      </div>
    
    );
  }
}