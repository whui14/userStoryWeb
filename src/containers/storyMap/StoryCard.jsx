import React, { Component } from 'react';
import StoryCardItem from './StoryCardItem'
import { log } from 'util';
export default class StoryCard extends Component {
    constructor(props){
        super(props)
        this.state = {
            cardList: props.cardList
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.cardList && prevProps.cardList !== this.props.cardList){
            this.setState({ cardList: this.props.cardList })
        }
    }
    handleDND = (dragIndex,hoverIndex) => {
        const { cardList } = this.state
        let tmp = cardList[dragIndex] //临时储存文件
        cardList.splice(dragIndex,1) //移除拖拽项
        cardList.splice(hoverIndex,0,tmp) //插入放置项
        this.setState({
            cardList
        })
    }

    render() {
        const { cardList } = this.state
        return (
            <div style={{ display: 'flex' }}>
                {cardList && cardList.map((item,index) => {
                    return(
                        <StoryCardItem
                        key={index}
                        card={item}
                        index={index}
                        handleAddModal={this.props.handleAddModal}
                        handleEditModal={this.props.handleEditModal}
                        fetchMapList={this.props.fetchMapList}
                    />
                    )
                })}
            </div>
        )
      }
    }
