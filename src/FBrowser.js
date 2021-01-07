import download from 'downloadjs';
import React from 'react';
import './FBrowser.css';

class FileBrowser extends React.Component {
    render() {
        return (
            <div onContextMenu={(e)=> e.preventDefault()} className="main-page">
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
                <Button buttonName="Back"/>
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
function getFiles(cb, currentPath, subFolder) {
    fetch("http://localhost:8080/api/folders/?path="+ currentPath + subFolder, {
        method: "GET",
        crossDomain: true
    })
    .then((response)=> response.json().then(json => {
        cb(json["result"]);
    }))
    .catch((error) => {
        console.error(error);
    });
}

class FileWindow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            files : [],
            currentPath : "/"
        }
        this.populateFileTable = this.populateFileTable.bind(this)
    }
    // This has to be changed later due to file change
    parseJsonResult(result) {
        return result;
    }

    populateFileTable(subFolder) {
        getFiles((fileResult)=> {
            this.setState({
                files :  fileResult,
                currentPath : this.state.currentPath + subFolder + "/"
            })
        }, this.state.currentPath, subFolder )    
    }

    componentDidMount() {
        this.populateFileTable("");
    }

    render() {
        return (
            <div className="FileWindow">
                <table id="FileWindowTable" cellspacing="0">
                    <tbody>
                        <FileHeader />
                        {this.state.files.map(file => 
                        <File populateFileTable={this.populateFileTable}  fileName={file["fileName"]} isDirectory={file["isDirectory"]} key={this.state.currentPath + file["fileName"]} path={this.state.currentPath + file["fileName"]} size="" lastModified="" />)
                        }
                   </tbody>
               </table>              
            </div>
        )
    }
}

class FileHeader extends React.Component {
    render() {
        return (
            <tr className="FileWindowHeader">
                <td className="col1 file-row">File Name</td>
                <td className="col2 file-row">Size</td>
                <td className="col3 file-row">Last Modified</td>
            </tr>
        )
    }
}

class File extends React.Component {
    constructor(props) {
        super(props);
        this.openFolder = this.openFolder.bind(this)
    }
    openFolder() {
        if (this.props.isDirectory) {
            // update current state
            this.props.populateFileTable(this.props.fileName)
        }
    }
    render() {
        return (
            <tr onDoubleClick={this.openFolder}  className="FileRow">
                <td className="col1 unselectable">{this.props.fileName}</td>
                <td className="col2">{this.props.size}</td>
                <td className="col3">{this.props.lastModified}</td>
                <td className="col4" >
                    <ControlButtonBlock fileName={this.props.fileName} path={this.props.path} isDirectory={this.props.isDirectory} />
                </td>
            </tr>
        )
    }
}

class ControlButtonBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            path : props.path,
            fileName : props.fileName,
            isDirectory: props.isDirectory
        }
        this.downloadFile = this.downloadFile.bind(this)
    }
    // https://stackoverflow.com/questions/35206589/how-to-download-fetch-response-in-react-as-file
    downloadFile() {
        fetch("http://localhost:8080/api/download/?path="+this.state.path, {
            method: "GET",
            crossDomain: true
        })
        .then((response)=> response.blob().then(blob => {
            console.log(this.state.fileName)
            return download(blob, this.state.fileName);
        }))
        .catch((error) => {
            console.error(error);
        });
    }
    
    render() {
        let downloadButton;
        if (this.state.isDirectory ===false) {
            downloadButton = <button className="button btn-download" onClick={this.downloadFile}></button>
        }
        return (
            <div className="ButtonBlock">
                {downloadButton}
                <button className="button btn-delete"></button>
            </div>
        )
    }
}

export {
    FileBrowser
}