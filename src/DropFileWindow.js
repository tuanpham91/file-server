import React, { Component } from 'react'
import { FileHeader } from './FileHeader';
import { File } from './File';

class DropFileWindow extends Component {
    
    dropRef = React.createRef()

    state = {
        dragging: false
    }

    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            // TODO Handle
        }
    }
    // No Dragout
    handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ dragging: false })
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.props.handleDrop(e.dataTransfer.files)
            e.dataTransfer.clearData()
            this.dragCounter = 0
        }
    }


    //https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929
    dropFileWindow = React.createRef();
    // executed after the first render only on the client side.
    componentDidMount() {
        let div = this.dropRef.current
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
    }
    //  is the last function to be called immediately before the component is removed from the DOM
    componentWillUnmount() {
        let div = this.dropRef.current
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }

    render() {
        return (
            <div ref={this.dropRef} className="FileWindow">
                <table id="FileWindowTable" cellSpacing="0">
                    <thead>
                        <FileHeader />
                    </thead>
                    <tbody>
                        {this.props.files.sort(
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
        );
    }
}


class DropFileWindowOverlay extends Component {
    render() {
        return (
            <div className="FileWindow Overlay">

            </div>
        )
    }

}

export {
    DropFileWindow,
    DropFileWindowOverlay
}