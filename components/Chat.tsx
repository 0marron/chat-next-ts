import React, { useEffect, useState, useRef, useReducer  } from 'react';
 
import{IsUrlAndImage, IsUrlAndMP4, IsUrlAndYoutube, isNullOrEmpty, getCookie, Base64, checkIsRoom} from '../Utils' ;
import 'react-image-lightbox/style.css';
 
import { UsersBar } from './UsersBar';
import * as signalR from '@microsoft/signalr';
 import { IMessage_FROM_Server,IMessage_FOR_Server, IUserInfo } from '../Interfaces';
 import { IUsersContainer, IMessagesContainer, IRoomsContainer } from '../Interfaces';
 import { TextField } from '../components/TextField';
 import { ModalPrivateRoom } from './ModalPrivateRoom';
 import { MessagesField } from './MessagesField';
 import { MessageValidator } from '../Utils';
export const Chat  = () => {
 
    const [usMes, setUsMes] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [usersSex, setUserSex] = useState({});
    const [usersBadge, setUserBadge] = useState({});
    const [activeTab, setActiveTab] = useState("Home");
    const [messageText, setMessageText] = useState("");
    const [enterUsers, setEnterUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [notifMan, setNotifMan] = useState(""); 
    const [notifWoman, setNotifWoman] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [roomsDic, setRoomsDic] = useState({});
    const [secretRoomUsers, setSecretRoomUsers] = useState({});
    const [pingAttempts, setPingAttempts] = useState(0);
    const [usersArr, setUsersArr] = useState([]);
   
    const [isOnSounds, setIsOnSounds] = useState("");
    const [notify, setNotify] = useState({user:"", showing: false});
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [myName, setMyName] = useState(null);
    
   // const [allUsers, setAllUsers] = useState<IUsersContainer>({});
 
     
    const [isMyConnectionDone, setIsMyConnectionDone] = useState(false);
    const [startTouch, setStartTouch] = useState(0);

    const [columnMessagessCSS, setColMessagessCSS] = useState({});
    const [isOnImage, setIsOnImage] = useState("");
    const [isOnScroll, setIsOnScroll] = useState("");
   
    const [prevTab, setPrevTab] = useState(null);
    const [modalMessage, setModalMessage] = useState("Введите пароль");
    const [nameClickText, setNameClickText] = useState("");
    const [columnUsersCSS, setColumnUsersCSS] = useState({});
 


    const usersInit: IUsersContainer = {
        "testuser":{"connectionid":"testuser","name":"testuser","sex":"m", "isroom": false},
        "dtjydtjydty":{"connectionid":"dtjydtjydty","name":"dtjydtjydty","sex":"w", "isroom": false},
        "sehserh":{"connectionid":"sehserh","name":"sehserh","sex":"w", "isroom": false},
        "dtyktdkdt":{"connectionid":"dtyktdkdt","name":"dtyktdkdt","sex":"w", "isroom": false},
        "dtkdtdttjjj":{"connectionid":"dtkdtdttjjj","name":"dtkdtdttjjj","sex":"m", "isroom": false},
        "tyjtyjrtyjrtyj":{"connectionid":"tyjtyjrtyjrtyj","name":"tyjtyjrtyjrtyj","sex":"m", "isroom": false},
        "Home":{"connectionid":"","name":"Home","sex":"r", "isroom": true},
        
    }

  

    const [listOfUsers, dispatch] = useReducer(reducer, {});
    const [rasegaerg, setrasegaerg] = useState({});

    const [privateMessages, setPrivateMessages] = useState<IMessagesContainer>({});
    const [publicMessages, setPublicMessages] = useState<IMessagesContainer>({});

    interface IActionReducer{
        type: string;
        payload:  IUsersContainer;
        keyToDelete: string;
    }
 
  

    function reducer(listOfUsers :IUsersContainer , action:IActionReducer) {
        switch(action.type){
            case "toAdd": return Object.assign(action.payload, listOfUsers);

           
            case "toRemove":  
                          const next = {...listOfUsers};
                          delete next[action.keyToDelete];
                          return next;
        }
    }
    function DeletePrivateTab(tab: string){
        let asd = listOfUsers;
         let copy = {...privateMessages};
         delete copy[tab];
         setPrivateMessages(copy);
    }
    function DeletePublicTab(tab: string){
        let asd = listOfUsers;
        let copy = {...publicMessages};
        delete copy[tab];
        setPublicMessages(copy);
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

    const privateMessagesInit: IMessagesContainer = {
        "testuser":[{
            textmessage: "message test message test message test message test",
            imageurl: "",
            fromwho:"sehserh",
            forwho: "",
            audio: "",
            room: "",
            imageastext: "",
            youtubeastext: "",
            videoastext: "",
            videofile: null,
            imagefile: null
        }],
    }

    const publicMessagesInit: IMessagesContainer = {
        "Home":[{
            textmessage: "fbtb tftb tbbbfbtfbfb dbdb dbdbdbdbtd bdtndtndd ersrgserg",
            imageurl: "",
            fromwho:"jjjtyjt",
            forwho: "",
            audio: "",
            room: "",
            imageastext: "",
            youtubeastext: "",
            videoastext: "",
            videofile: null,
            imagefile: null
        },
        {
            textmessage: "fbtbgb dbdbdbdbtd bdtndtndd ersrgserg",
            imageurl: "",
            fromwho:"tyjtyjrtyjrtyj",
            forwho: "",
            audio: "",
            room: "",
            imageastext: "",
            youtubeastext: "",
            videoastext: "",
            videofile: null,
            imagefile: null
        },
        {
            textmessage: "fbtb tfwgbtd bdtndtndd ersrgserg",
            imageurl: "",
            fromwho:"dtkdtdttjjj",
            forwho: "",
            audio: "",
            room: "",
            imageastext: "",
            youtubeastext: "",
            videoastext: "",
            videofile: null,
            imagefile: null
        }] 
    }
    const myNameRef = useRef("");
    const textfieldRef: React.LegacyRef<HTMLInputElement> = useRef(null);
    const DoSubmit = (event: React.FormEvent<HTMLFormElement>, textToSend: string) => {
        event.preventDefault();
        let Message: IMessage_FOR_Server = MessageValidator(textToSend);
        Message.fromwho =  myName;

        if(checkIsRoom(listOfUsers[activeTab])){
            Message.room = activeTab;
        }
        else{
            Message.forwho = activeTab;   
        }
        connection.invoke("MessageHandler", Message);

        
        textfieldRef.current.focus();
     }
 

    useEffect(() => {   
        setPublicMessages(publicMessagesInit);
        setPrivateMessages(privateMessagesInit);
    }, []);
    
    useEffect(() => {
        let connect = new signalR.HubConnectionBuilder().withUrl("https://localhost:7061/chat?name=&sex=&isroom=false").build()
        setConnection(connect);
      },[])
    
    useEffect(() => {
        if (connection) {
           
          
              connection.start().then(() => {
              connection.on("PrivateResponse", (message: IMessage_FROM_Server , fromwho) => {
                    const copy = privateMessages;
               
                  
                    if(message.fromwho === myNameRef.current){
                        if( (message.forwho in copy) !== true){
                            copy[message.forwho] = [];
                        }
                         copy[message.forwho].push(message);
                         setPrivateMessages(copy);
                    }
                    if(message.fromwho !== myNameRef.current){
                        if( (message.fromwho in copy) !== true){
                            copy[message.fromwho] = [];
                        }
                         
                         copy[message.fromwho].push(message);
                         setPrivateMessages(copy);
                    }
                    
              });
              connection.on("PublicResponse", (message , fromwho) => {
                    const copy = publicMessages;
                    if( (message.room in copy) !== true){
                        copy[message.room] = [];
                    }
                    copy[message.room].push(message);
                    setPublicMessages(copy);
              });

              connection.on("GhostLoginResponse", (userslist: IUsersContainer) => {
                console.log("");
                let q = rasegaerg;
                setrasegaerg(userslist);
                dispatch({type: "toAdd", payload: userslist, keyToDelete: null});
              });

              connection.on("LoginNotifyGhost", (message, connectionid: string, user: IUserInfo ) => {
               
                     let key_value_pair: { [key: string]: {} } = { };
               //   all_users[connection.connectionId] = {"connectionid":connection.connectionId,"name":connection.connectionId,"sex":"w", "isroom": false};
                     key_value_pair[user.name] = user;
               //     setAllUsers({...all_users});
               //   dispatch({type: "toAdd", payload: key_value_pair, keyToDelete: null});
              
               connection.invoke("GettingUsersListOnce");

                   if(!isMyConnectionDone){
                        myNameRef.current = connection.connectionId;
                        setMyName(connection.connectionId);
                        connection.invoke("GettingUsersListOnce");
                        console.log("");
                   }
          
                //  setNotify({user: message, showing: true});

                  setIsMyConnectionDone(true);
              
              });
              connection.on("Disconnect", (username: string) => {
                let q = rasegaerg;
                let fsasd = listOfUsers;
                let reherh = privateMessages;
                let jfyftyj = publicMessages;
                DeletePublicTab(username);
                DeletePrivateTab(username);
                try{ DeletePublicTab(username);} catch{}
                try{ DeletePrivateTab(username);} catch{}
                dispatch({type: "toRemove", payload: null, keyToDelete: username});

            //    let all_users =  allUsers;
            //    delete all_users[username];
           //     setAllUsers({...all_users});
                if(!isMyConnectionDone){
                  //  setMyName(connection.connectionId);
                }
        
              //  setNotify({user: message, showing: true});

                setIsMyConnectionDone(true);
            
            });
            }) 
            .catch(
                (error) => console.log(error)
                );
        }
      }, [DeletePrivateTab, DeletePublicTab, connection, isMyConnectionDone, listOfUsers, privateMessages, publicMessages, rasegaerg]);

    // if (!isLoading) {
    //     return (
    //         <div>
    //             <h1>Загрузка...</h1>
    //             <img src="https://hg1.funnyjunk.com/gifs/How+do+i+computer+i+decided+to+try+my+hands_81418e_4707807.gif"/>
    //         </div>
    //     );
    // } else {
        return (
            <div className="row" onTouchStart={(e) => onTap(e)} onTouchMove={(e) =>moveTouch(e)} >
                 <ModalPrivateRoom modalMessage={modalMessage} setModalMessage={setModalMessage} prevTab={prevTab} showModal={showModal} setShowModal={setShowModal} setShow={setShow} show={show}/>
                 <UsersBar listOfUsers={listOfUsers} myNameRef={myNameRef} activeTab={activeTab} setActiveTab={setActiveTab} />
                 <MessagesField publicMessages={publicMessages} privateMessages={privateMessages} myNameRef={myNameRef} notify={notify} setNotify={setNotify} activeTab={activeTab} setActiveTab={setActiveTab}  />
                 <TextField textfieldRef={textfieldRef} DoSubmit={DoSubmit}/>
            </div>
         );
   // }
}


 
 

 
 
 

 