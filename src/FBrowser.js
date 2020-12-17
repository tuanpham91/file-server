import React from 'react';
//https://reactjs.org/docs/state-and-lifecycle.html
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
                <button>Create Folder </button>
                <button>Upload File </button>
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