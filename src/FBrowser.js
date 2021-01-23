import download from 'downloadjs';
import React from 'react';
import './FBrowser.css';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import FolderRoundedIcon from '@material-ui/icons/FolderRounded';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';

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
        .then(
            this.props.addFileToState(
                // TODO: filePath does not matter, for now
                {"isDirectory":true,"fileName":folderName ,"filePath":this.props.currentPath}
            )
        )
    }
    
    handleTextFieldChange(e) {
        this.setState({
            newFolderName: e.target.value
        });
    }

    render() {
        return (
            <span className="NewFolderNameInput">
            <Box component="span">
                <TextField onChange={this.handleTextFieldChange} size="small" label="Folder Name" variant="outlined" />
            </Box>
            <Box component="span">
                <IconButton  
                    onClick={() => {
                        this.createNewFolder(this.state.newFolderName)
                        this.props.showNewFolderInput(false)
                    }}
                    aria-label="delete" 
                    color="primary">
                    <CheckIcon />
                </IconButton>
            </Box>
            <Box component="span">
            <IconButton 
                onClick={() => {
                    this.props.showNewFolderInput(false)
                }}
                aria-label="delete" 
                color="primary">
                <ClearIcon />
            </IconButton>
            </Box>
            </span>
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
        this.uploadFile = this.uploadFile.bind(this)
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
        fetch('http://localhost:8080/api/upload/?path=' + this.props.currentPath, {
            method: 'POST',
            body: form
        })
        .then(
            this.props.addFileToState(
                // TODO: filePath does not matter, for now
                {"isDirectory":false,"fileName":file.name ,"filePath":this.props.currentPath}
            )
        )
        
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
                <Box component="span" pl={3}>
                    <Button onClick={this.props.goBack} variant="contained" color="primary">Back</Button>
                </Box>
                <Box component="span" pl={3}>
                    <Button onClick={()=>{this.upload.click()}} variant="contained"  color="primary">Upload File</Button>
                </Box>
                <Box component="span" pl={3}>
                    <Button onClick={()=> this.showNewFolderInput(true)} variant="contained"  color="primary">Create Folder</Button>
                </Box>
                { creatingFolder ? 
                <CreateFolderPopup 
                    addFileToState={this.props.addFileToState}
                    currentPath={this.props.currentPath}
                    showNewFolderInput={this.showNewFolderInput}
                />
                : 
                null }
            </div>
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
        this.addFileToState = this.addFileToState.bind(this)
    }

    // This has to be changed later due to file change
    parseJsonResult(result) {
        return result;
    }
    // this looks like shite

    buildPathFromArray(pathArray, subFolder) {
        return pathArray.join("/") + "/";
    }

    addFileToState(file) {
        var files = this.state.files;
        files.push(file)
        this.setState({
            files: files
        })
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

    // sort : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    render() {     
        return (
            <div className="main-page">
                <BrowserHeader
                    currentPath={this.state.currentPath}
                    addFileToState={this.addFileToState}
                    goBack={this.goBack}
                />
                <div className="FileWindow">
                    <table id="FileWindowTable" cellSpacing="0">
                        <thead>
                            <FileHeader />
                        </thead>
                        <tbody>
                            {this.state.files.sort(
                                (a, b) => a.isDirectory < b.isDirectory
                            )
                            .map(file =>
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
            <tr className="FileWindowHeader FileRow ">
                <th className="col0">
                </th>
                <th className="col1">File Name</th>
                <th className="col2">Size</th>
                <th className="col3">Last Modified</th>
                <th className="col4"></th>
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
        let fileIcon
        if (this.props.file.isDirectory) {
            fileIcon = <FolderRoundedIcon style={{ 
                fontSize: 25,
                color: "#ffcc00"
             }} />
        } else {
            fileIcon = <DescriptionOutlinedIcon style={{ 
                fontSize: 25
            }}/>
        }
            
        return (
            <tr onDoubleClick={this.openFolder} className="FileRow">
                <td className="col0 unselectable fileName">
                    {fileIcon}
                </td>
                <td className="col1 unselectable fileName">
                    {this.props.file.fileName}
                </td>
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
        let deleteButton;
        if (this.state.file.isDirectory === true) {
            deleteButton = 
            <IconButton disabled aria-label="delete">
                <DeleteIcon />
            </IconButton>
            downloadButton = 
            <IconButton disabled aria-label="delete">
                <GetAppIcon />
            </IconButton>

        } else {
            deleteButton =  
            <IconButton onClick={this.deleteFile} aria-label="delete">
                <DeleteIcon />
            </IconButton>
            downloadButton =
            <IconButton onClick={this.downloadFile} aria-label="delete">
                <GetAppIcon />
            </IconButton>
        }
        return (
            <div className="ButtonBlock">
                {downloadButton}
                {deleteButton}
            </div>
        )
    }
}

export {
    FileWindow
}