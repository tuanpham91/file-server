import download from 'downloadjs';
import React from 'react';
import './FBrowser.css';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

class CreateFolderPopup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            newFolderName : ""
        }
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.createNewFolder = this.createNewFolder.bind(this);
    }

    //https://stackoverflow.com/questions/25385559/rest-api-best-practices-args-in-query-string-vs-in-request-body
    createNewFolder(folderName) {
        var currentPath = this.props.currentPath;
        // TODO 
        fetch('http://localhost:8080/api/folder/create/?path='+ currentPath +'&folderName=' + folderName, {
            method: 'POST'
        })
        .then()
    }
    
    handleTextFieldChange(e) {
        this.setState({
            newFolderName: e.target.value
        });
    }

    render() {
        return (
            <div className="NewFolderNameInput">
            <TextField onChange={this.handleTextFieldChange} size="small" label="Folder Name" variant="outlined" />
            <IconButton 
                onClick={() => {
                     //this.createNewFolder(this.state.newFolderName)
                     console.log("Close box!")
                     this.props.showNewFolderInput(false)
                }}
                aria-label="delete" 
                color="primary">
                <CheckIcon />
            </IconButton>
            <IconButton aria-label="delete" color="primary">
                <ClearIcon />
            </IconButton>
            </div>
        )
    }
}

class BrowserHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            creatingFolder : false
        }
        this.showNewFolderInput = this.showNewFolderInput.bind(this)
    }

    showNewFolderInput(show) {
        this.setState({
            creatingFolder : show
        })
    }
    
    uploadFile(event) {
        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];
        var form = new FormData();
        form.append("file", file)
        fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            body: form
        })
        .then()
    }   

    render() {
        // TODO https://stackoverflow.com/questions/41819342/how-to-hide-and-show-a-div-in-react
        var creatingFolder = this.state.creatingFolder;
        return (
            <div className="Header">
                <input id="myInput"
                    type="file"
                    ref={(ref) => this.upload = ref}
                    style={{ display: 'none' }}
                    onChange={this.uploadFile.bind(this)}
                />

                <Button onClick={this.props.goBack} buttonName="Back" />
                <Button buttonName="UploadFile" onClick={()=>{this.upload.click()}}/>
                <Button buttonName="Create Folder" onClick={this.showNewFolderInput}  />
                { creatingFolder ? 
                <CreateFolderPopup 
                    currentPath={this.props.currentPath}
                    showNewFolderInput={() => this.showNewFolderInput(true)}
                /> 
                : 
                null }
            </div>
        )
    }
}

class Button extends React.Component {
    render() {
        return (
            <button onClick={this.props.onClick} className="Button">{this.props.buttonName}</button>
        )
    }
}
function getFiles(cb, currentPath) {
    fetch("http://localhost:8080/api/folders/?path=" + currentPath, {
        method: "GET",
        crossDomain: true
    })
        .then((response) => response.json().then(json => {
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
            files: [],
            pathArray: [],
            currentPath: ""
        }
        this.populateFileTable = this.populateFileTable.bind(this)
        this.goBack = this.goBack.bind(this)
        this.removeFileFromState = this.removeFileFromState.bind(this)
    }
    // This has to be changed later due to file change
    parseJsonResult(result) {
        return result;
    }
    // this looks like shite

    buildPathFromArray(pathArray, subFolder) {
        return pathArray.join("/") + "/";
    }

    removeFileFromState(filePath) {
        var files = this.state.files;
        var removedFileIndex = files.findIndex(file => file["filePath"] === filePath)
        files.splice(removedFileIndex, 1)
        this.setState({
            files: files
        })
    }

    calculatePath(subFolder, goBack) {
        // if go back, then go back one level and thats it.
        let newPathArray;
        let newCurrentPath;
        if (goBack === true) {
            newPathArray = this.state.pathArray;
            newPathArray.pop();
            newCurrentPath = this.buildPathFromArray(newPathArray);
        } else {
            newPathArray = this.state.pathArray.concat(subFolder);
            newCurrentPath = this.buildPathFromArray(newPathArray);
        }
        this.setState({
            pathArray: newPathArray,
            currentPath: newCurrentPath
        });
        return newCurrentPath;
    }

    populateFileTable(subFolder, goBack) {
        var result = this.calculatePath(subFolder, goBack);
        getFiles((fileResult) => {
            this.setState({
                files: fileResult
            })
        }, result)
    }

    goBack() {
        this.populateFileTable("", true);
    }

    componentDidMount() {
        this.populateFileTable("", false);
    }

    render() {
        return (
            <div className="main-page">
                <BrowserHeader
                    currentPath={this.state.currentPath}
                    goBack={this.goBack}
                />
                <div className="FileWindow">
                    <table id="FileWindowTable" cellSpacing="0">
                        <tbody>
                            <FileHeader />
                            {this.state.files.map(file =>
                                <File 
                                    populateFileTable={this.populateFileTable}
                                    removeFileFromState={this.removeFileFromState}
                                    file={file}
                                    key={this.state.currentPath + file["fileName"]}
                                    size=""
                                    lastModified="" />)
                            }
                        </tbody>
                    </table>
                </div>
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
        if (this.props.file.isDirectory) {
            // update current state
            this.props.populateFileTable(this.props.file.fileName, false)
        }
    }
    render() {
        return (
            <tr onDoubleClick={this.openFolder} className="FileRow">
                <td className="col1 unselectable fileName">{this.props.file.fileName}</td>
                <td className="col2">{this.props.file.size}</td>
                <td className="col3">{this.props.lastModified}</td>
                <td className="col4" >
                    <ControlButtonBlock
                        removeFileFromState={this.props.removeFileFromState}
                        file={this.props.file} />
                </td>
            </tr>
        )
    }
}

class ControlButtonBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            file: props.file
        }
        this.downloadFile = this.downloadFile.bind(this)
        this.deleteFile = this.deleteFile.bind(this)
    }
    // https://stackoverflow.com/questions/35206589/how-to-download-fetch-response-in-react-as-file
    downloadFile() {
        const file = this.state.file
        fetch("http://localhost:8080/api/download/?path=" + file["filePath"], {
            method: "GET",
            crossDomain: true
        })
            .then((response) => response.blob().then(blob => {
                return download(blob, file.fileName);
            }))
            .catch((error) => {
                console.error(error);
            });
    }

    deleteFile() {
        const file = this.state.file;
        const filePath = file["filePath"]
        fetch("http://localhost:8080/api/file/delete/?path=" + filePath, {
            method: "DELETE",
            crossDomain: true
        })
            .then(response => response.text())
            .catch((error) => {
                console.error(error);
            });
        this.props.removeFileFromState(filePath)
    }

    render() {
        let downloadButton;
        if (this.state.file.isDirectory === false) {
            downloadButton = <button className="button btn-download" onClick={this.downloadFile}></button>
        }
        return (
            <div className="ButtonBlock">
                {downloadButton}
                <button onClick={this.deleteFile} className="button btn-delete"></button>
            </div>
        )
    }
}

export {
    FileWindow
}