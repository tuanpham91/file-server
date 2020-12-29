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
            <div class="Header">
                <Button buttonName="Create Folder"/>
                <Button buttonName="UploadFile"/>
            </div>
        )
    }
}

class Button extends React.Component {
    render() {
        return (
            <button class="Button">{this.props.buttonName}</button>
        )
    }
}

class FileWindow extends React.Component {
    render() {
        return (
            <div class="FileWindow">
            </div>
        )
    }

}

class File extends React.Component {
    render() {
        return(
            <div>

            </div>
        )
    }
}

export {
    FileBrowser
}