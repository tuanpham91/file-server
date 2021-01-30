import React from 'react';
import './FBrowser.css';
import File from './File';
import BrowserHeader from './BrowserHeader';
import FileHeader from './FileHeader';
import File from './File';

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
export {
    FileWindow
}