import './App.css';
import React from 'react';
import ListSelect from './ListSelect.js'
import { TextField } from '@material-ui/core';

export default class App extends React.Component
{
  constructor()
  {
    super();

    this.resetSelectedOptions();
  }

  resetSelectedOptions()
  {
    this.selectedQuality = "";
    this.selectedFormat = "";
  }

  onURLChanged()
  {
    
  }

  onQualitySelected()
  {

  }

  onFormatSelected()
  {

  }

  render()
  {
    return (

      <div className="background">
        <header className="app-title">
          Youtube Downloader
        </header>
        <TextField label="URL" variant="standard" type="string" onChange={() => { this.onURLChanged(); }}/>
        <ListSelect title="Quality" options={[10, 20, 30]} onSelectedOption={() => { this.onQualitySelected(); }}/>
        <ListSelect title="Format" options={["mp4", "mov"]} onSelectedOption={() => { this.onFormatSelected(); }}/>
      </div>
    
    );
  }
}
