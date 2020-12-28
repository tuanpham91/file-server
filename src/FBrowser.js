import React from 'react';

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
            <div>
                <Button buttonName="Create Folder"/>
                <Button buttonName="UploadFile"/>
            </div>
        )
    }
}

class Button extends React.Component {
    render() {
        return (
            <div>
                <button>{this.props.buttonName}</button>
            </div>
        )
    }
}

class FileWindow extends React.Component {
    render() {
        return (
            <div>
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