import React from 'react';
import './FBrowser.css';

class FileBrowser extends React.Component {
    render() {
        return (
            <div className="main-page">
                <BrowserHeader />
                <FileWindow />
            </div>
        )
    }
}

class BrowserHeader extends React.Component {
    render() {
        return (
            <div className="Header">
                <Button buttonName="Create Folder" />
                <Button buttonName="UploadFile" />
            </div>
        )
    }
}

class Button extends React.Component {
    render() {
        return (
            <button className="Button">{this.props.buttonName}</button>
        )
    }
}

class FileWindow extends React.Component {
    constructor(props) {
        super(props)
        this.getFiles = this.getFiles.bind(this);

    }

    getFiles() {
        fetch("http://localhost:8080/api/folders/", {
            method: "GET",
            crossDomain: true
        })
        .then((response)=> response.json().then(json => {
            return json["result"];
        }))
        .catch((error) => {
            console.error(error);
        });
    }


    render() {
        return (
            <div className="FileWindow">
                <table id="FileWindowTable">
                    <tbody>
                        <FileHeader />
                        { this.getFiles().map(file => 
                            <File fileName={file} size="" lastModified="" />
                        )}
                    </tbody>
               </table>              
            </div>
        )
    }
}

class FileHeader extends React.Component {
    render() {
        return (
            <tr className="FileHeader">
                <td className="col1">{this.props.fileName}</td>
                <td className="col2">{this.props.size}</td>
                <td className="col3">{this.props.lastModified}</td>
            </tr>
        )
    }
}

class File extends React.Component {

    render() {
        return (
            <tr className="FileRow">
                <td className="col1 file-row">File Name</td>
                <td className="col2 file-row">Size</td>
                <td className="col3 file-row">Last Modified</td>
            </tr>
        )
    }
}

export {
    FileBrowser
}