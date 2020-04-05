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
              <div className="options-container">
                <ListSelect title="Quality" loading={false} options={["10", "20", "30"]} onSelect={this.handleOnQualitySelected.bind(this)}/>
                <ListSelect title="Format" loading={false} options={[".mp4", ".mov"]} onSelect={this.handleOnFormatSelected.bind(this)}/>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

    );
  }
}
