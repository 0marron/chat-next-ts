import React, { useEffect, useState, createRef ,  useRef, useReducer  } from 'react';
 
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
 import { Form, Button } from 'react-bootstrap';
import { UserInfo } from 'os';
  
export const Chat  = () => {
 
    const [usMes, setUsMes] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [usersSex, setUserSex] = useState({});
    const [usersBadge, setUserBadge] = useState({});
    const [activeTab, setActiveTab] = useState("Home");
    const [messageText, setMessageText] = useState("");
    const [enterUsers, setEnterUsers] = useState([]);
    const [show, setShow] = useState(false);
 
    const [showModal, setShowModal] = useState(false);
    const [roomsDic, setRoomsDic] = useState({});
    const [secretRoomUsers, setSecretRoomUsers] = useState({});
    const [pingAttempts, setPingAttempts] = useState(0);
    const [usersArr, setUsersArr] = useState([]);

    const [notifMan, setNotifMan] = useState<boolean>(false); 
    const [notifWoman, setNotifWoman] = useState<boolean>(false);
    const [isOnImage, setIsOnImage] = useState<boolean>(false);
   
    const [isOnSounds, setIsOnSounds] = useState<boolean>(false);

    const [notify, setNotify] = useState({alert:"", showing: false});
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [myName, setMyName] = useState(null);
    
   // const [allUsers, setAllUsers] = useState<IUsersContainer>({});
 
    const [isLogined, setIsLogined] = useState(false);

    const [isMyConnectionDone, setIsMyConnectionDone] = useState(false);
    const [startTouch, setStartTouch] = useState(0);

    const [columnMessagessCSS, setColMessagessCSS] = useState({});
    const [connectionId, setConnectionId] = useState(null);
   
    const [prevTab, setPrevTab] = useState(null);
    const [modalMessage, setModalMessage] = useState("Введите пароль");
    const [nameClickText, setNameClickText] = useState("");
    const [columnUsersCSS, setColumnUsersCSS] = useState({});
 
    const [loginValue, setLoginValue] = useState("");
 
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
    const [privateMessages, setPrivateMessages] = useState<IMessagesContainer>({});
    const [publicMessages, setPublicMessages] = useState<IMessagesContainer>({});
    const myNameRef = useRef("");
    const activeTabRef = useRef<string>("Home");

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
        "testuser2":[{
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
        "testuser3":[{
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
        }]
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
  
    const textfieldRef: React.LegacyRef<HTMLInputElement> = useRef(null);
    const DoSubmit = (event: React.FormEvent<HTMLFormElement>, textToSend: string) => {
        event.preventDefault();
        let Message: IMessage_FOR_Server = MessageValidator(textToSend);
        Message.fromwho =  myNameRef.current;

        if(checkIsRoom(listOfUsers[activeTab])){
            Message.room = activeTab;
        }
        else{
            Message.forwho = activeTab;   
        }
        connection.invoke("MessageHandler", Message);
        
        textfieldRef.current.focus();
     }
  

    function DoSendPhoto(url: string){
        let Message: IMessage_FOR_Server = MessageValidator(url);
        Message.fromwho =  myNameRef.current;

        if(checkIsRoom(listOfUsers[activeTab])){
            Message.room = activeTabRef.current;
        }
        else{
            Message.forwho = activeTabRef.current; 
        }
        connection.invoke("MessageHandler", Message);
    }
    function DoSendAudio(url: string){
        let Message: IMessage_FOR_Server = MessageValidator(url);
        Message.fromwho =  myNameRef.current;
        let asddd = activeTabRef.current;
        if(checkIsRoom(listOfUsers[activeTabRef.current])){
            Message.room = activeTabRef.current;
        }
        else{
            Message.forwho = activeTabRef.current;   
        }
        connection.invoke("MessageHandler", Message);
    }
 
    useEffect(() => {
         let domain = process.env.NODE_ENV ==="production" ? "https://chatmenow.ru" : "https://localhost:7061";

        let connect = new signalR.HubConnectionBuilder().withUrl(`${domain}/chat?name=&sex=&isroom=false`).build();
        setConnection(connect);
      },[])
    
    useEffect(() => {
        if (connection) {
            
              
              connection.start().then(() => { setConnectionId(connection.connectionId);
          
              connection.on("PrivateResponse", (message: IMessage_FROM_Server , fromwho) => {
                     
                const refPrivateMessages = privateMessages;
                if(message.fromwho === myNameRef.current){
                    if( (message.forwho in refPrivateMessages) !== true){
                        refPrivateMessages[message.forwho] = [];
                    }
                     refPrivateMessages[message.forwho].push(message);
                     setPrivateMessages({...refPrivateMessages});
                }
                if(message.fromwho !== myNameRef.current){
                    if( (message.fromwho in refPrivateMessages) !== true){
                        refPrivateMessages[message.fromwho] = [];
                    }
                     refPrivateMessages[message.fromwho].push(message);
                     setPrivateMessages({...refPrivateMessages});
                }
              });

              connection.on("PublicResponse", (message , fromwho) => {
                    const refPublicMessages = publicMessages;
                    if( (message.room in refPublicMessages) !== true){
                        refPublicMessages[message.room] = [];
                    }
                    refPublicMessages[message.room].push(message);
                    setPublicMessages({...refPublicMessages});
              });


              
              connection.on("UpdateListOfUsers", (userslist: IUsersContainer) => {
                dispatch({type: "toAdd", payload: userslist, keyToDelete: null});
              });
              connection.on("ModifyUser", (OldUser: IUserInfo, NewUser: IUserInfo) => {
                removeUserData(OldUser);
               
               if(connection.connectionId === NewUser.connectionid){
                    myNameRef.current = NewUser.name;
                    setIsLogined(true);
               }
                  connection.invoke("GettingUsersListOnce");
              });
               

              connection.on("LoginNotifyGhost", (message, connectionid: string, user: IUserInfo ) => {
               
                if(connection.connectionId === connectionid) {
                    myNameRef.current = user.name;
                }
                   connection.invoke("GettingUsersListOnce");
                   setNotify({alert: message, showing: true});
 
              });
              connection.on("Alerts", (message: string) => {
                 setNotify({alert: message, showing: true});
              });
              connection.on("Disconnect", (RemovedUser: IUserInfo) => {
                removeUserData(RemovedUser);
            });
           

            }) 
            .catch((error) => console.log(`Error!   ${error}`));
        }
      }, [connection]);

     function removeUserData(user: IUserInfo){
        let copyPrivateMessages = Object.assign({}, privateMessages);
        delete copyPrivateMessages[user.name];
        setPrivateMessages(copyPrivateMessages);

        let copyPublicMessages = {...publicMessages};
        delete copyPublicMessages[user.name];
        setPublicMessages(copyPublicMessages);

        dispatch({type: "toRemove", payload: null, keyToDelete: user.name});
     }
    // if (!isLoading) {
    //     return (
    //         <div>
    //             <h1>Загрузка...</h1>
    //             <img src="https://hg1.funnyjunk.com/gifs/How+do+i+computer+i+decided+to+try+my+hands_81418e_4707807.gif"/>
    //         </div>
    //     );
    // } else {

    function onLoginHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let user: IUserInfo = {
            connectionid : connection.connectionId,
            name: loginValue,
            sex : "m",
            isroom: false
        }
        connection.invoke("UserLogin", user);
        console.log("");
    }

   
    const RowCSS = {
        login : { height: "calc(100% - 150px)" },
        logoff : { height: "calc(100% - 50px)" }
   }

        return (
            <div className="row" style={isLogined ? RowCSS.logoff : RowCSS.login } onTouchStart={(e) => onTap(e)} onTouchMove={(e) =>moveTouch(e)} >
                 <ModalPrivateRoom modalMessage={modalMessage} setModalMessage={setModalMessage} prevTab={prevTab} showModal={showModal} setShowModal={setShowModal} setShow={setShow} show={show}/>
                 <UsersBar activeTabRef={activeTabRef} listOfUsers={listOfUsers} myNameRef={myNameRef} activeTab={activeTab} setActiveTab={setActiveTab} />
                 <MessagesField  activeTabRef={activeTabRef} DoSendAudio={DoSendAudio} DoSendPhoto={DoSendPhoto} listOfUsers={listOfUsers} connectionId={connectionId} activeTab={activeTab} setNotifWoman={setNotifWoman} setNotifMan={setNotifMan} notifMan={notifMan} notifWoman={notifWoman} setIsOnSounds={setIsOnSounds}   setIsOnImage={setIsOnImage} isOnImage={isOnImage}   isOnSounds={isOnSounds} publicMessages={publicMessages} privateMessages={privateMessages} myNameRef={myNameRef} notify={notify} setNotify={setNotify}  setActiveTab={setActiveTab}  />
             
             { !isLogined &&
               (<div className="login-field" style={{height:"100px", width:"100%"}}>
                <Form onSubmit={(e)=> onLoginHandler(e)} className="login-form">
                    <Form.Control size="sm" className="login-input" required value={loginValue} onChange={(e)=> setLoginValue(e.currentTarget.value)} type="text" placeholder="Введите свой логин" />
                    <Button size="lg" variant="primary" type="submit"  >
                        Авторизоваться
                    </Button>
                </Form>
                </div>)
              }
                 <TextField textfieldRef={textfieldRef} DoSubmit={DoSubmit}/>
            </div>
         );
   // }
}


 
 

 
 
 

 