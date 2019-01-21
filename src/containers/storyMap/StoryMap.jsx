import React, { Component } from 'react';
import data from './data.json';
import StoryCard from './StoryCard';
import Board from 'react-trello';


export default class StoryMap extends Component {
    constructor(props) {
        super(props);
        this.state = {};
      }
    onDataChange = (e) => {
        console.log('datachange',e)
    }
    onCardDelete= (e) => {
        console.log('delete',e)
    }
    onCardAdd= (e) => {
        console.log('add',e)
    }
    onCardClick= (e) => {
        console.log('click',e)
    }
    render(){
        return (
            <Board data={data} 
            onDataChange={this.onDataChange}
            onCardDelete={this.onCardDelete}
            onCardAdd={this.onCardAdd}
            onCardClick={this.onCardClick}
            editable
            draggable
            />
        )
    }
}