import React, { useEffect, useState, useMemo } from 'react';
 
import {   Tab, Tabs, Toast, Button, ToggleButton, Badge, Alert, DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
 
import {useInterval} from '../Utils';
import{IsUrlAndImage, IsUrlAndMP4,IsUrlAndYoutube, isNullOrEmpty, getCookie, Base64, checkIsRoom} from '../Utils' ;
import 'react-image-lightbox/style.css';
 import {IMessageToSend} from '../Interfaces';
import $ from 'jquery';

import {AlertDismissibleExample} from './AlertDismissibleExample';
 
import { Sidebar } from './Sidebar';


import {ModalPrivateRoom} from './ModalPrivateRoom';
import { HubConnection } from "@microsoft/signalr";
export const UsersItems = (props) => {
 
    const [columnMessagessCSS, setColMessagessCSS] = useState({});
    const [isOnImage, setIsOnImage] = useState("");
    const [isOnScroll, setIsOnScroll] = useState("");
    const [show, setShow] = useState(false);
    const [prevTab, setPrevTab] = useState(null);
    const [modalMessage, setModalMessage] = useState("Введите пароль");
    const [nameClickText, setNameClickText] = useState("");
    const [columnUsersCSS, setColumnUsersCSS] = useState({});
    const [startTouch, setStartTouch] = useState(0);
 

    const SendRequest = (gifUrl) => {
        var cookie = getCookie("Session");
        let recipient = props.activeTab;
        let isRoom = checkIsRoom(props.roomsDic, recipient);
        var text = (document.getElementById("textfield") as HTMLFormElement).value;
        if (gifUrl != null) {
            text = gifUrl;
        }
        var _imageastext = IsUrlAndImage(text);
        var _youtubeastext = IsUrlAndYoutube(text);
        var _videoastext = IsUrlAndMP4(text);   

        props.AddLocalMessage(text, "", null, cookie, recipient, props.usMes, _imageastext, _youtubeastext, _videoastext);//Add local text message with global obj

        fetch('/ChatPage/Send',
            {
                method: 'POST',
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipient: recipient,
                    sender: cookie,
                    message: text,
                    isThisRoom: isRoom
                })
            });


            (document.getElementById("textfield") as HTMLFormElement).value = "";


            ( document.getElementById("textfield") as HTMLFormElement).focus();
            ( document.getElementById("textfield") as HTMLFormElement).select();
        

    }
  
    
    function oncheckedHandler(e, tab) {
        setPrevTab(props.activeTab);
        if ((tab in props.roomsDic) && (props.roomsDic[tab].isPassword)) {
            if (tab in props.secretRoomUsers) {
                if (!props.secretRoomUsers[tab].includes(props.cookie)) {
                    setShow(true)
                    setModalMessage("Введите пароль от секретной комнаты");
                }
            }
        }
      
        props.setActiveTab(tab);

        var barge = props.usersBadge;
        barge[tab] = null;
        props.setUserBadge(barge); 
        
   }

    useEffect(() => {
        props.setActiveTab('Home');
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
    }, [props.activeTab]);
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

 
    function onTap(event) {
        setStartTouch ( event.touches[0].clientX);
    }

    function moveTouch(event) {
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
        <>
        <div className="row" onTouchStart={(e) => onTap(e)} onTouchMove={(e) =>moveTouch(e)} >
            <ModalPrivateRoom modalMessage={modalMessage} setModalMessage={setModalMessage} prevTab={prevTab} activeTab={props.activeTab} setActiveTab={props.setActiveTab} userName={props.cookie} show={show} setShow={setShow} />
           <div className="columnusers" id="cleft" style={columnUsersCSS } >
               <ul id="users">
                   {
                       props.usersArr.map(function (name, i) {
                           return (
                               <li key={name} id={name} >
                                   <ToggleButton
                                       className="leftUserName"
                                       disabled={name == props.cookie ? true : false}
                                       type="checkbox"
                                       variant="info"
                                       checked={name == props.activeTab ? true : false}
                                       value={i}
                                       onChange={(e) => oncheckedHandler(e, name)}
                                       style={props.usersSex[name] == "w" ? womanCSS : manCSS}                                    >
                                       

                                       
                                       <Badge  >{props.usersBadge[name]}</Badge>
                                       {("Home" in props.roomsDic) && (props.roomsDic["Home"].isPassword != undefined) && name === "Home" && <img src="./crown.png" style={{ height: '20px', width: '20px' }} />} {/*костыль*/}
                                       {(name in props.roomsDic) && (props.roomsDic[name].isPassword != undefined) && props.roomsDic[name].isPassword && <img src="./lock.png" style={{ height: '20px', width: '20px' }} />} {/*костыль*/}
                                       

                                       {Base64.decode(name)}
                                       {(name in props.roomsDic) && (props.roomsDic[name].isPassword != undefined) && !props.roomsDic[name].isPassword && <img src="./open.png" style={{ height: '20px', width: '20px' }} />} {/*костыль*/}

                                
                                       
                                   </ToggleButton>
                               </li>
                           );
                       })

                   }
               </ul>
           </div>
           <div className="columntext" id="cright">
               <ul id="messages">
                   <Tabs defaultActiveKey="Home" unmountOnExit={false} activeKey={props.activeTab} transition={false} id="noanim-tab-example" className="chatTabs"  >
                       {
                           Object.keys(props.usMes).map(function (name, i) {
                               return (
                                   <Tab eventKey={name} title={name} key={i} className="message-field" disabled>
                                       {
                                           props.usMes[name].map((mes, z) => {
                                               return (
                                                   <AlertDismissibleExample key={z} cookie={props.cookie} setNameClickText={setNameClickText} nameClickText={nameClickText}   secretRoomUsers={props.secretRoomUsers} usersSex={props.usersSex} username={mes.username} fromwho={mes.fromwho} textmessage={mes.textmessage} imageurl={mes.imageurl} islocal={mes.islocal} audio={mes.audio} isOnImage={isOnImage} isOnSounds={props.isOnSounds} imageastext={mes.imageastext} youtubeastext={mes.youtubeastext} videoastext={mes.videoastext} isOnScroll={isOnScroll} setIsOnImage={setIsOnImage} setIsOnSounds={props.setIsOnSounds} setIsOnScroll={setIsOnScroll} setMessageText={props.setMessageText} {...props} />
                                                     
                                               );
                                           })
                                       }
                                   </Tab>
                               );
                           })
                       }

                   </Tabs>
               
               </ul>
                <Sidebar   sendRequest={SendRequest }  secretRoomUsers={props.secretRoomUsers} setShowModal={props.setShowModal} activeTab={props.activeTab} cookieName={props.cookie} setIsOnImage={setIsOnImage} setIsOnSounds={props.setIsOnSounds} setIsOnScroll={setIsOnScroll} isOnImage={isOnImage} isOnSounds={props.isOnSounds} isOnScroll={isOnScroll} messageText={props.messageText} setMessageText={props.setMessageText} {...props} />
               <div
                   aria-live="polite"
                   aria-atomic="true"
                   style={{
                       position: 'absolute',
                       height: '50px',
                       top: 2,
                       right: 52
                   }}
                >
                    {props.show && props.enterUsers.length > 0 &&
                    <Toast onClose={() => props.setShow(false)} show={props.show} delay={3000} autohide>
                        <Toast.Body>В чат заходят:   {props.enterUsers.map(function (name, key) { return (<span key={key}> {name} </span>) })} </Toast.Body>
                    </Toast>}    
               </div>
           </div>
       
       </div>
             <TextField sendRequest={SendRequest} activeTab={props.activeTab}  {...props} />
             </>
       );
}

const TextField = (props) => {
    const [isShowEmoji, setShowEmoji] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [textToSend, setTextToSend] = useState(null);
    const onEmojiClick = (event, emojiObject) => {
        var text = (document.getElementById("textfield")as HTMLFormElement).value;
        (document.getElementById("textfield") as HTMLFormElement).value = text + emojiObject.emoji;
        document.getElementById("textfield").focus();
       // document.getElementById("textfield").select();
    };
   
    


 

   const DoSubmit = (event) => {
       event.preventDefault();

       const MessageValidator: IMessageToSend = (text: string)=>{

         let emptyMessage = {
            textmessage: null,
            imageurl: null,
            fromwho: string;
            forwho: string|null;
            audio: string|null;
            chatRoomName: string|null;
            imageastext: string|null;
            youtubeastext: string|null;
            videoastext: string|null;
         }
        
       } 
       (props.connection as HubConnection).invoke("BackMessageReciever",textToSend);
    }

    const emojiClickHandler = () => {
        setShowEmoji(!isShowEmoji);
        ( document.getElementById("textfield") as HTMLFormElement).focus();
        ( document.getElementById("textfield") as HTMLFormElement).select();
    }
    const openRightMenu = () => {
        if (document.getElementById("rightMenu").style.display == "block") {
            document.getElementById("rightMenu").style.display = "none";
        } else {
            document.getElementById("rightMenu").style.display = "block";
        }
    }
    const closeRightMenu = () => {
        document.getElementById("rightMenu").style.display = "none";
    }
   return (
    <>
       <div className="underchat">
            <form className="loginform" action="/Send" method="post" onSubmit={(e) => DoSubmit(e)}>
                <input id="textfield" className="textfield" type="text" placeholder="" value={textToSend} onChange={(e)=> {setTextToSend(e.target.value)}} autoComplete="off" name="temp" style={{ paddingRight:'50px' }} required />
                <input className="sendbutton" type="submit" value="Send"   />
            </form>
        
               <label id="emojipicker" onClick={emojiClickHandler} >
                  <img src="./smile.png" style={{ width: 35 + 'px', height: 35 + 'px', marginLeft: '7.5px', marginTop: '7.5px', marginBottom: '7.5px', marginRight: '7.5px', display: 'block' }} />
               </label>
       </div>
       {/* { isShowEmoji && (<Picker native={true} onEmojiClick={onEmojiClick} disableAutoFocus={true} preload={false} skinTone={SKIN_TONE_NEUTRAL} disableSearchBar={true} preload={false} pickerStyle={{ right: '0px', bottom: '50px', position: 'absolute' }} />)}*/}
    </>
        
       );
}