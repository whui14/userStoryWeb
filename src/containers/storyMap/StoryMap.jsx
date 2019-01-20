import React, { Component } from 'react';
import data from './data.json';
import StoryCard from './StoryCard';
import Board from 'react-trello';


export default class StoryMap extends Component {
    render(){
        return (
            <Board data={data} 
            // onDataChange={onDataChange}
            // onCardDelete={onCardDelete}
            // onCardAdd={onCardAdd}
            // onCardClick={onCardClick}
            editable
            draggable
            />
        )
    }
}