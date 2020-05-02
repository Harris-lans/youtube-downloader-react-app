import './App.css';
import React from 'react';
import ListSelect from './ListSelect.js';
import TextField from './TextField.js';
import VideoDetails from './VideoDetails.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const axios = require('axios').default;

export default class App extends React.Component
{
	constructor(props)
	{
		super(props);

		// Setting initial state
		this.state = {
			url : "",
			isURLValid : "",
			selectedQuality : "",
			selectedFormat : ""
		};
	}

	async queryURLValidity(url)
	{
		let isValid = false; 

		if (!this.isStringEmpty(url))
		{
			const response = await axios.get('http://localhost:1300/verify-url', {

				responseType: 'json',
				params:{
					url: url
				}

			});

			isValid = response.data.isValid;
		}
		
		return isValid;
	}

	async getVideoOptions(url)
	{
		let options = {};

		if (!this.isStringEmpty(url))
		{
			const response = await axios.get('http://localhost:1300/video-details', {

				responseType: 'json',
				params:{
					url: url
				}

			});

			console.log(response.data);
		}
	}

	downloadVideo(url)
	{
		if (!this.isStringEmpty(url))
		{
			axios.get('http://localhost:1300/download-video', {

				responseType: 'blob',
				params:{
					videoURL: url
				}

			}).then( (response) => {
				
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download');
				document.body.appendChild(link);
				link.click();

			});
		}
	}

	handleOnURLChanged(value)
	{
		const url = value;
		this.setState({ url });

		// Checking if the url is valid and getting download options
		this.queryURLValidity(url).then((isValid) => 
		{
			this.setState({isURLValid : isValid});
			this.getVideoOptions(url).then((options) => {

			});
		});
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

	isStringEmpty(string)
	{
		return string.replace(" ", "") === "";
	}

	render()
	{
		return (

		<div className="background">
			<header className="app-header">Youtube Downloader</header>
			<div className="app-body">
			<Card>
				<Card.Title>
				<TextField label="URL" subText="Enter the URL of the video you want to download" inputMode="url" onChange={this.handleOnURLChanged.bind(this)}/>
				</Card.Title>
				<Card.Body>
				<VideoDetails videoName="Title" videoThumbnailURL="https://img.youtube.com/vi/PH2-oM7IWpY/maxresdefault.jpg" videoChannelName="Channel"></VideoDetails>
				<div className="options-container">
					<ListSelect title="Quality" loading={false} options={["10", "20", "30"]} onSelect={this.handleOnQualitySelected.bind(this)}/>
					<ListSelect title="Format" loading={false} options={[".mp4", ".mov"]} onSelect={this.handleOnFormatSelected.bind(this)}/>
				</div>
				<div>
					<Button size="lg">Download Video</Button>
				</div>
				</Card.Body>
			</Card>
			</div>
		</div>

		);
	}
}
