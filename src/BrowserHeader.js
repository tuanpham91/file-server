import React from 'react'
import Button from '@material-ui/core';
import Box from '@material-ui/core/Box';

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

export {
    BrowserHeader
}