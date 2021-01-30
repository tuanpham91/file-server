import React from 'react';
import './FBrowser.css';

class FileHeader extends React.Component {
    render() {
        return (
            //Fix https://stackoverflow.com/questions/21168521/table-fixed-header-and-scrollable-body
            <tr className="FileWindowHeader FileRow ">
                <th className="left-text col0">
                </th>
                <th className="left-text col1">File Name</th>
                <th className="left-text col2">Size</th>
                <th className="left-text col3">Last Modified</th>
                <th className="left-text col4"></th>
            </tr>
        )
    }
}

export {
    FileHeader
}
