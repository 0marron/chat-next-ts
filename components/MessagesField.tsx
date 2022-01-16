import React, { useEffect, useState, useMemo, FC } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import{ IsUrlAndImage, IsUrlAndMP4,IsUrlAndYoutube, getCookie, Base64, checkIsRoom} from '../Utils' ;
import 'react-image-lightbox/style.css';
import { NotifyBadge } from '../components/NotifyBadge';
 
 
import { Message } from './Message';
import { Sidebar } from './Sidebar';
 
 
import {IMessagesContainer, IMessage_FROM_Server } from '../Interfaces';
 
interface IMessagesField{
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    activeTab: string;
    publicMessages: IMessagesContainer;
    privateMessages: IMessagesContainer;
    notify: {user: string;showing: boolean;},
    setNotify: React.Dispatch<React.SetStateAction<{user: string;showing: boolean;}>>
    myNameRef: React.MutableRefObject<string>
}

export const MessagesField:FC<IMessagesField> = (props) => {
 
    const [columnMessagessCSS, setColMessagessCSS] = useState({});
    const [isOnImage, setIsOnImage] = useState("");
    const [isOnScroll, setIsOnScroll] = useState("");
   
    const [prevTab, setPrevTab] = useState(null);
    const [modalMessage, setModalMessage] = useState("Введите пароль");
    const [nameClickText, setNameClickText] = useState("");
    const [columnUsersCSS, setColumnUsersCSS] = useState({});
    const [startTouch, setStartTouch] = useState(0);
   
 

    useEffect(() => {
       
        if (isOnScroll) {
            var cleft = document.getElementById("cright");
            cleft.scrollTop = cleft.scrollHeight;
        }
    }, []);
    useEffect(() => {
       
        if (isOnScroll) {
            var cleft = document.getElementById("cright");
            cleft.scrollTop = cleft.scrollHeight;
        }
    }, [isOnScroll, props.activeTab]);
    const changeSizeLeftMenu = () => {
        setColMessagessCSS(onRightCSS); 
        setColumnUsersCSS(onLeftCSS);
         
    }
    const changeSizeRightMenu = () => {
        setColMessagessCSS(offRightCSS); 
        setColumnUsersCSS(offLeftCSS);
        
    }
    const onLeftCSS = {
        width: "45%",
        position: "fixed",
        overflow: "auto"  
    }
    const onRightCSS = {
        width: "55%",
        position: "fixed",
        overflow: "auto" 
      
    }
    const offLeftCSS = {
        width: "85px",
        position: "fixed",
        overflow: "auto" 
    }
    const offRightCSS = {
        width: "calc(100% - 85px)",
        position: "fixed",
        overflow: "auto" 
        
    }

 
    function onTap(event: any) {
        setStartTouch ( event.touches[0].clientX);
    }

    function moveTouch(event: any) {
        var x = event.changedTouches[0].clientX;

        var move = startTouch - x;
        if (move < -100) {
            console.log("open");
            changeSizeLeftMenu();
             
        }
        if (move > 100) {
            console.log("close");
            changeSizeRightMenu();
        }
        console.log(move)
    }
    const womanCSS = {
        backgroundColor: "rgb(255, 182, 193)"
    }
    const manCSS = {
        backgroundColor: "rgb(172, 194, 188)"
    }
    return (
        <div className="columntext" id="cright">
        <NotifyBadge {...props}/> {/*Ghost user entered notif*/}
        <ul id="messages">
            <Tabs defaultActiveKey="Home" unmountOnExit={false} activeKey={props.activeTab} transition={false} id="noanim-tab-example" className="chatTabs"  >
                {
                     Object.keys(props.publicMessages).map(function (name: string, index: number) {
                         return (
                             <Tab eventKey={name} title={name} key={index} className="message-field" disabled>
                                 {
                                     props.publicMessages[name].map((message: IMessage_FROM_Server, message_key: number) => {
                                         return (
                                             <Message key={message_key} message={message}  {...props} />
                                         );
                                     })
                                 }
                             </Tab>
                         );
                     })
                }

                {
                     Object.keys(props.privateMessages).map(function (name: string, index: number) {
                         return (
                             <Tab eventKey={name} title={name} key={index} className="message-field" disabled>
                                 {
                                     props.privateMessages[name].map((message: IMessage_FROM_Server, message_key) => {
                                         return (
                                            <Message key={message_key} message={message} {...props} />                                         );
                                     })
                                 }
                             </Tab>
                         );
                     })
                }
            </Tabs>
        </ul>
         <Sidebar setIsOnImage={setIsOnImage} setIsOnScroll={setIsOnScroll} isOnImage={isOnImage} isOnScroll={isOnScroll} {...props} />
    </div>
       );
}