import React, { Component } from 'react';
import Board from 'react-trello';
import styles from './StoryCard.scss'
import { EditNameIcon } from '../../images/svg'

export default class StoryCard extends Component {

    render(){
        const { cardColor,name, dueOn,subTitle,body,escalationText } = this.props
        return (
            <div className={styles.cardContainer}>
                <header
                    className={styles.cardHeader}>
                    <div style={{fontSize: 16, fontWeight: 'bold', color:'#4a4a4a'}}>{name}</div>
                    <div style={{fontSize: 12, color: '#F5A623'}}>{dueOn}</div>
                </header>
                <div className={styles.cardContent}>
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
