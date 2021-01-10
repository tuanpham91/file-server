import download from 'downloadjs';
import React from 'react';
import './FBrowser.css';

class BrowserHeader extends React.Component {
    render() {
        return (
            <div className="Header">
                <Button populateFileTable={this.props.populateFileTable}buttonName="Back"/>
                <Button buttonName="Create Folder" />
                <Button buttonName="UploadFile" />
            </div>
        )
    }
}

class Button extends React.Component {
    render() {
        return (
            <button onClick={this.props.populateFileTable} className="Button">{this.props.buttonName}</button>
        )
    }
}
function getFiles(cb, currentPath) {
    fetch("http://localhost:8080/api/folders/?path="+ currentPath, {
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
            pathArray : [],
            currentPath : ""
        }
        this.populateFileTable = this.populateFileTable.bind(this)
    }
    // This has to be changed later due to file change
    parseJsonResult(result) {
        return result;
    }
    // this looks like shite

    buildPathFromArray(pathArray) {
        return pathArray.join("/")+"/";
    }

    calculatePath(subFolder, goBack) {
        // if go back, then go back one level and thats it.
        var result = this.buildPathFromArray(this.state.pathArray)
        if(goBack) {
            this.setState ({
                pathArray : this.state.pathArray.pop(),
                currentPath : result
            });
        } else {
            this.setState ({
                pathArray : this.state.pathArray.concat(subFolder),
                currentPath : result
            });
        }
        return result;
    }

    populateFileTable(subFolder, goBack) {
        var result =  this.calculatePath(subFolder, goBack);
        getFiles((fileResult)=> {
            this.setState({
                files :  fileResult
            })
        }, result)    
    }

    componentDidMount() {
        this.populateFileTable("",false);
    }

    render() {
        return (
            <div className="main-page">                
                <BrowserHeader 
                    populateFileTable={this.populateFileTable}
                />
            <div className="FileWindow">
                <table id="FileWindowTable" cellSpacing="0">
                    <tbody>
                        <FileHeader />
                        {this.state.files.map(file => 
                        <File 
                            populateFileTable={this.populateFileTable}  
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
            <tr onDoubleClick={this.openFolder}  className="FileRow">
                <td className="col1 unselectable">{this.props.file.fileName}</td>
                <td className="col2">{this.props.file.size}</td>
                <td className="col3">{this.props.lastModified}</td>
                <td className="col4" >
                    <ControlButtonBlock 
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
            file : props.file
        }
        this.downloadFile = this.downloadFile.bind(this)
    }
    // https://stackoverflow.com/questions/35206589/how-to-download-fetch-response-in-react-as-file
    downloadFile() {
        const file = this.state.file
        fetch("http://localhost:8080/api/download/?path="+file["filePath"], {
            method: "GET",
            crossDomain: true
        })
        .then((response)=> response.blob().then(blob => {
            return download(blob, file.fileName);
        }))
        .catch((error) => {
            console.error(error);
        });
    }
    
    render() {
        let downloadButton;
        if (this.state.file.isDirectory ===false) {
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
    FileWindow
}