import './App.css';
import React from 'react';
import ListSelect from './ListSelect.js';
import TextField from './TextField.js';
import VideoDetails from './VideoDetails.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

const axios = require('axios').default;
const streamSaver = require('streamsaver');
const serverURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

export default class App extends React.Component
{
	constructor(props)
	{
		super(props);

		// Setting initial state
		this.state = {
			url : "",
			isURLValid : false,
			isValidating : false,
			isLoadingVideoDetails : false,
			selectedQualityOptionID : 0,
			qualityOptions : [],
			videoThumbnailURL : "",
			videoTitle : "",
			videoChannelName : "",
			videoUploadDate : ""
		};
	}

	async queryURLValidity(url)
	{
		let isValid = false; 

		if (!this.isStringEmpty(url))
		{
			const response = await axios.get(`${serverURL}/verify-url`, {

				responseType: 'json',
				params:{
					url: url
				}

			});

			isValid = response.data.isValid;
		}
		
		return isValid;
	}

	async getVideoDetails(url)
	{
		let options = {};

		if (!this.isStringEmpty(url))
		{
			const response = await axios.get(`${serverURL}/video-details`, {

				responseType: 'json',
				params:{
					url: url
				}

			});

			options = response.data;
		}

		return options;
	}

	requestVideoDownload(url, qualityTag)
	{
		const fileStream = streamSaver.createWriteStream(`${this.state.videoTitle}.mp4`);

		fetch(`${serverURL}/download-video?videoURL=${url}&qualityTag=${qualityTag}`).then((response) => {

			const readableStream = response.body;

			if (window.WritableStream && readableStream.pipeTo) 
			{
				return readableStream.pipeTo(fileStream);
			}
		});
	}

	handleOnURLChanged(value)
	{
		const url = value;
		this.setState({ 
			url : url,
			isValidating : true
		});

		// Checking if the url is valid and getting download options
		this.queryURLValidity(url).then((isValid) => 
		{
			this.setState({
				isURLValid : isValid,
				isValidating: false,
			});

			if (isValid)
			{
				this.setState({ isLoadingVideoDetails : true });

				this.getVideoDetails(url).then((details) => {
	
					this.setState({
						isLoadingVideoDetails: false,
						videoTitle: details.title,
						videoChannelName: details.channelName,
						videoUploadDate: details.uploadDate,
						videoThumbnailURL: details.thumbnailURL,
						qualityOptions: details.qualityOptions,
					});
	
				});
			}

		});
	}

	handleOnQualityOptionSelected(id, value)
	{
		const selectedQualityOptionID = id;
		this.setState({ selectedQualityOptionID });
	}

	handleOnDownloadButtonSelected()
	{
		this.requestVideoDownload(this.state.url, this.state.selectedQualityOptionID);
	}

	isStringEmpty(string)
	{
		return string.replace(" ", "") === "";
	}

	render()
	{
		let cardBody = "";

		if (this.state.isValidating)
		{
			cardBody = (
				<Card.Body>
					<div className="loading-spinner-box">
						<Spinner className="inline-block" animation="border" variant="primary"/>
						<div className="inline-block">Validating...</div>
					</div>
				</Card.Body>
			);
		}
		else if (this.state.isLoadingVideoDetails)
		{
			cardBody = (
				<Card.Body>
					<div className="loading-spinner-box">
						<Spinner className="inline-block" animation="border" variant="primary"/>
						<div className="inline-block">Loading Video Details...</div>
					</div>
				</Card.Body>
			);
		}
		else if (this.state.isURLValid)
		{
			cardBody = (

				<Card.Body>
					<VideoDetails videoThumbnailURL={this.state.videoThumbnailURL} videoName={this.state.videoTitle} videoChannelName={this.state.videoChannelName} videoUploadDate={this.state.videoUploadDate}></VideoDetails>
					<div className="options-container">
						<ListSelect title="Quality Options" loading={false} options={this.state.qualityOptions} onSelect={this.handleOnQualityOptionSelected.bind(this)}/>
					</div>
					<div className="button-container">
						<Button className="button" size="lg" onClick={this.handleOnDownloadButtonSelected.bind(this)}>Download Video</Button>
					</div>
				</Card.Body>

			);
		}
		else if (this.isStringEmpty(this.state.url))
		{
			cardBody = <Card.Body/>;
		}
		else
		{
			cardBody = (

				<Card.Body>
					<div className="invalidity-message">
						Invalid URL. Please enter a different URL
					</div>
				</Card.Body>

			);
		}

		return (

			<div className="background">
				<header className="app-header">Youtube Downloader</header>
				<div className="app-body">
				<Card>
					<Card.Title>
						<TextField label="URL" subText="Enter the URL of the video you want to download" inputMode="url" onChange={this.handleOnURLChanged.bind(this)}/>
					</Card.Title>
					{cardBody}
				</Card>
				</div>
			</div>

		);
	}
}
