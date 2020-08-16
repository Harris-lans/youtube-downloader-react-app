import './style.css';
import React from 'react';
import config from '../../config';
import streamSaver from 'streamsaver';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TextField } from '../../components/TextField';
import { ListSelect } from '../../components/ListSelect';
import { VideoDetails } from '../../components/VideoDetails';

export class App extends React.Component
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

	async queryURLValidity(videoURL)
	{
		let isValid = false; 

		if (!this.isStringEmpty(videoURL))
		{
			const url = new URL(`${config.api.uri}/video/verification`);
			url.search = new URLSearchParams({ url: videoURL });

			const response = await fetch(url, { method: 'GET' });
			const responseBody = await response.json();
			isValid = responseBody.isValid;
		}
		
		return isValid;
	}

	async getVideoDetails(videoURL)
	{
		let details = {};

		if (!this.isStringEmpty(videoURL))
		{
			const url = new URL(`${config.api.uri}/video/details`);
			url.search = new URLSearchParams({ url: videoURL });

			const response = await fetch(url, { method: 'GET' });
			const responseBody = await response.json();
			details = responseBody;
		}

		return details;
	}

	async downloadVideo(videoURL, qualityTag)
	{
		const fileStream = streamSaver.createWriteStream(`${this.state.videoTitle}.mp4`);
		
		const url = new URL(`${config.api.uri}/video`);
		url.search = new URLSearchParams({ url: videoURL, quality_tag: qualityTag });

		fetch(url, { method: "GET" }).then((response) =>
		{
			for (let pair of response.headers.entries())
			{
				console.log(pair);
			}
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
		this.downloadVideo(this.state.url, this.state.selectedQualityOptionID);
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
