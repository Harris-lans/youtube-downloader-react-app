import './style.css';
import React from 'react';
import Image from 'react-bootstrap/Image';

export default class VideoDetails extends React.Component
{
    render()
    {
        return (

            <div className="video-details">
                <Image className="video-thumbnail" src={this.props.videoThumbnailURL} rounded/>
                <div className="video-details-container">    
                    <div className="video-name">{this.props.videoName}</div>
                    <div className="video-channel">{this.props.videoChannelName}</div>
                    <div className="video-upload-date">Uploaded on {this.props.videoUploadDate}</div>
                </div>
            </div>

        );
    }
}
