import React, { Component } from 'react';
import Board from 'react-trello';


export default class StoryCard extends Component {

    render(){
        const { cardColor,name, dueOn,subTitle,body,escalationText } = this.props
        return (
            <div>
                <header
                    style={{
                    borderBottom: '1px solid #eee',
                    paddingBottom: 6,
                    marginBottom: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    color: cardColor
                    }}>
                    <div style={{fontSize: 14, fontWeight: 'bold'}}>{name}</div>
                    <div style={{fontSize: 11}}>{dueOn}</div>
                </header>
                <div style={{fontSize: 12, color: '#BD3B36'}}>
                    <div style={{color: '#4C4C4C', fontWeight: 'bold'}}>{subTitle}</div>
                    <div style={{padding: '5px 0px'}}>
                    <i>{body}</i>
                    </div>
                    <div style={{marginTop: 10, textAlign: 'center', color: cardColor, fontSize: 15, fontWeight: 'bold'}}>
                    {escalationText}
                    </div>
                </div>
            </div>
        )
    }
}