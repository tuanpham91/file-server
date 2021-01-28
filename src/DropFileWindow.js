import React, { Component } from 'react'
class DropFileWindow extends Component {
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
}
