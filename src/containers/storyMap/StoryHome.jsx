import React, { Component } from 'react';
import styles from './StoryHome.scss'
import { withRouter } from 'react-router';
import { message, Button } from 'antd';
import { PandaSvg } from '../../images/svg'
class StoryHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
          mapList: []
        };
      }
      componentDidMount(){
          this.fetchStoryList()
      }
      fetchStoryList = () => {
        const { match } = this.props;
        console.log(match)
        var getInformation ={
          method:"GET",
          headers:{
          "Content-Type":"application/json",
          token: match.params.token,
          userId: match.params.id
          },
          }
          fetch("http://119.23.29.56:2228/map/list",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              this.setState({ mapList: json.data })
            }
            else {
              message.error(json.data);
            }
          })
      }
      render(){
        const { mapList } = this.state
          console.log(mapList)
          return (
            <div className={styles.homeContainer}>
              <div className={styles.homeTop}>
                <div>
                  <Button className={styles.homeAddBtn}>
                    添加故事地图
                  </Button>
                </div>
                <div>
                  <PandaSvg className={styles.homeLogoutSvg}/>
                  <Button className={styles.homeLogoutBtn}>
                    退出登录
                  </Button>
                </div>

              </div>
              {mapList.length > 0 ?
              <div className={styles.homeContent}>
                {mapList.map((m, index) => {
                  return(
                    <div className={styles.homeContentItem} key={index}>
                      这里是一个个story
                    </div>
                  )
                })
                }
              </div>
              :
              <div className={styles.homeNoContent}>
                您的故事地图列表是空的呦，快快去创建吧！
              </div>
            }
            </div>
          )
      }
}
export default withRouter(StoryHome);
