import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import FolderRoundedIcon from '@material-ui/icons/FolderRounded';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import download from 'downloadjs';

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
                <td className="col0 left-text unselectable fileName">
                    {fileIcon}
                </td>
                <td className="col1 left-text unselectable fileName">
                    {this.props.file.fileName}
                </td>
                <td className="col2 left-text">{this.props.file.fileSize}</td>
                <td className="col3 left-text">{this.props.file.lastModified}</td>
                <td className="col4 left-text" >
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
    File
}