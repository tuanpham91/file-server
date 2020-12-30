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
    
    getFiles() {
        fetch("http://localhost:8080/api/folders/", {
            method: "GET",
            crossDomain: true
        })
        .then((response)=> response.json().then(json => {
            console.log(json)
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
                        {this.getFiles()}
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
                <td className="col1">File Name</td>
                <td className="col2">Size</td>
                <td className="col3">Last Modified</td>
            </tr>
        )
    }
}

class File extends React.Component {
    render() {
        return (
            <div>

            </div>
        )
    }
}

export {
    FileBrowser
}