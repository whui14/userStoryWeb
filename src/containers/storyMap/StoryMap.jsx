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
    handleLaneDragEnd = (laneId, newPosition, payload) => {
        console.log('lanedrag',laneId, newPosition, payload)
    }
    handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        console.log('drag',cardId, sourceLaneId, targetLaneId, position, cardDetails)
    }
    render(){
        return (
            <Board data={data} customCardLayout
                onDataChange={this.onDataChange}
                onCardDelete={this.onCardDelete}
                onCardAdd={this.onCardAdd}
                onCardClick={this.onCardClick}
                handleLaneDragEnd={this.handleLaneDragEnd}
                handleDragEnd={this.handleDragEnd}
                canAddLanes
                editable
                draggable>
                <StoryCard cardColor='#eee' 
                name='笑话'
                dueOn='nizaigansha'
                subTitle='xiao'
                body='说点啥'
                escalationText='这是啥'
                />
            </Board>
        )
    }
}