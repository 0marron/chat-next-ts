import React, { useEffect, useState, useMemo, useReducer } from 'react';
 
import{IsUrlAndImage, IsUrlAndMP4, IsUrlAndYoutube, isNullOrEmpty, getCookie, Base64, checkIsRoom} from '../Utils' ;
import 'react-image-lightbox/style.css';
import { UsersItems } from '../components/UsersItems';
import * as signalR from '@microsoft/signalr';
 import { IMessage_FROM_Server, IUserInfo } from '../Interfaces';
 import { IUsersContainer, IMessagesContainer, IRoomsContainer } from '../Interfaces';
 

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
    const [privateMessages, setPrivateMessages] = useState<IMessagesContainer>({});
    const [publicMessages, setPublicMessages] = useState<IMessagesContainer>({});
     
    const [isMyConnectionDone, setIsMyConnectionDone] = useState(false);

    const usersInit: IUsersContainer = {
        "testuser":{"connectionid":"testuser","name":"testuser","sex":"m", "isroom": false},
        "dtjydtjydty":{"connectionid":"dtjydtjydty","name":"dtjydtjydty","sex":"w", "isroom": false},
        "sehserh":{"connectionid":"sehserh","name":"sehserh","sex":"w", "isroom": false},
        "dtyktdkdt":{"connectionid":"dtyktdkdt","name":"dtyktdkdt","sex":"w", "isroom": false},
        "dtkdtdttjjj":{"connectionid":"dtkdtdttjjj","name":"dtkdtdttjjj","sex":"m", "isroom": false},
        "tyjtyjrtyjrtyj":{"connectionid":"tyjtyjrtyjrtyj","name":"tyjtyjrtyjrtyj","sex":"m", "isroom": false},
        "Home":{"connectionid":"","name":"Home","sex":"m", "isroom": true},
        
    }

    const [allUsers, dispatch] = useReducer(reducer, {});
    interface IActionReducer{
        type: string;
        payload:  IUsersContainer;
        keyToDelete: string;
    }
    
    function reducer(allUsers :IUsersContainer , action:IActionReducer) {
        switch(action.type){
            case "toAdd": return Object.assign(action.payload, allUsers);

           
            case "toRemove":  
                          const next = {...allUsers};
                          delete next[action.keyToDelete];
                          return next;
        }
    }

    const requirements = {

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
   

    var cookieName = getCookie("Session");
      
    
   
     async function fetchStartMessages( ) {
         const response = await fetch('/ChatPage/StartMessages', {
             method: 'POST',
             headers: { "Accept": "application/json", "Content-Type": "application/json" },
             body: JSON.stringify({})
         }) 
         return response.json();
    }


    function removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }

    async function dataHandler(data) {

        let str_ = JSON.stringify(data);
        var _badgeDic = usersBadge;
        if (Object.keys(_badgeDic).length === 0) {
            data.userlist.forEach((element) => { 
                    _badgeDic[element.name] = null; //fill badge
            })
            data.secretrooms.forEach((element) => {
                    _badgeDic[element.roomname] = null; // fill badge
            })
            data.publicrooms.forEach((element) => {
                _badgeDic[element.roomname] = null; // fill badge
            })
      }

      var users_and_rooms_names_arr = [];
      if (usersArr.length !== 0) {
          users_and_rooms_names_arr = usersArr;
      }
  

        var _roomsDic = {};
        var _sexDic = {};
        var _secretRoomsUsersArr = [];
        var _secretRoomsUsersDic = {};
        var beepflag = false;
        var newNamesList = [];
        data.userlist.forEach((element) => {   // добавление юзеров
            _sexDic[element.name] = element.sex;
            newNamesList.push(element.name);
            if (!users_and_rooms_names_arr.includes(element.name)) {
                users_and_rooms_names_arr.push(element.name);
            }
             
        })
      data.publicrooms.forEach((element) => { // добавление комнат
          newNamesList.push(element.roomname);
          if (!users_and_rooms_names_arr.includes(element.roomname)) {
              users_and_rooms_names_arr.push(element.roomname);
          }
            _roomsDic[element.roomname] = { name: element.roomname, isPassword: false };
        })
      data.secretrooms.forEach((element) => { // добавление комнат
          newNamesList.push(element.roomname);
            element.currentmembers.forEach((user) => {
                _secretRoomsUsersArr.push(user);
            })
            _secretRoomsUsersDic[element.roomname] = _secretRoomsUsersArr;
            if (!users_and_rooms_names_arr.includes(element.roomname)) {
                users_and_rooms_names_arr.push(element.roomname);
            }
            _roomsDic[element.roomname] = { name: element.roomname, isPassword: true };
        })

    
       
       
      var elementsToDelete = [];
      users_and_rooms_names_arr.forEach((element) => {
          if (!newNamesList.includes(element)) {
              elementsToDelete.push(element);
          }
      })

      elementsToDelete.forEach((item) => {
          users_and_rooms_names_arr = removeItemOnce(users_and_rooms_names_arr, item);
      })
   
   

      



        setSecretRoomUsers(_secretRoomsUsersDic);
        setRoomsDic(_roomsDic);
        setUserSex(_sexDic);
      

        var _messages = data.messages;
       
 
        
     //   var obj = Object.assign({}, usMes);
        var obj = usMes;

        var objUsersArr = usersArr;
      
        if (Object.keys(obj).length === 0 && obj.constructor === Object) {

            users_and_rooms_names_arr.forEach((element) => { //fulfill new users
                obj[element] = [];
                objUsersArr.push(element);
            })
        }
        var usersForToasts = [];

        users_and_rooms_names_arr.forEach((element) => { //add coming users to object key value list
             
                if (!(element in obj)) {//если пользователя нет в словаре - добавить в словарь и в список юзеров
                    obj[element] = [];
                    
                    _badgeDic[element] = null; // fill badge

                    if (_sexDic[element] == "m" && notifMan) {
                        usersForToasts.push(Base64.decode(element) + "\n");
                        setShow(true)
                    }
                    if (_sexDic[element] == "w" && notifWoman) {
                        usersForToasts.push(Base64.decode(element) + "\n");
                        setShow(true)
                    }
                    //TODO добавляем юзеров для нотификации. валидируем с настройками
                  
                     
                }   
        })
        users_and_rooms_names_arr.forEach((element) => { //add coming  users name to array
            if (!objUsersArr.includes(element)) {
                objUsersArr.push(element);
            }
        
        })
        //_users.forEach((element) => { //add new user
        //    if (!(element in obj)) {
        //        obj[element] = [];
        //        _badgeDic[element] = null; // fill badge
        //    }
        //})

        if (notifWoman || notifMan) {
             setEnterUsers(usersForToasts);
        }
  
        _messages.forEach((element) => {  //add message

             

            if (IsUrlAndImage(element.textmessage)) {
                element.imageastext = element.textmessage;
            }
            if (IsUrlAndYoutube(element.textmessage) !=null) {
                element.youtubeastext = IsUrlAndYoutube(element.textmessage);
            }

            if (!isNullOrEmpty(element.chatroomname)) { // если сообщение для комнаты 
                var messFrom = element.chatroomname



                if (messFrom in obj) {
                    if (activeTab != messFrom) {
                        _badgeDic[messFrom] = _badgeDic[messFrom] + 1;   // add barge
                       
                        //for (var item in obj) {
                        //    if (item == messFrom) {
                        //        var _value = obj[messFrom];
                        //        var _key = item;
                        //        delete (obj[_key]);

                        //        var newObj = {};
                        //        newObj[_key] = _value;

                        //        obj = Object.assign(   newObj,obj);
                        //    }
                        //}
                        //objUsersArr.forEach(function (item, i) {
                        //    if (item === messFrom) {
                        //        objUsersArr.splice(i, 1);
                        //        objUsersArr.unshift(item);
                        //    }
                        //});

                    }
                     obj[messFrom].push(element);
                }
            }
            if (isNullOrEmpty(element.chatroomname)) { // если сообщение в личку
                var messFrom = element.fromwho;
                if (messFrom in obj) {
                    if (activeTab != messFrom) {
                        
                        
                        //for (var item in obj) {
                        //    if (item == messFrom) {
                        //        var _value = obj[messFrom];
                        //        var _key = item;
                        //        delete (obj[_key]);

                        //        var newObj = {};
                        //        newObj[_key] = _value;

                        //        obj = Object.assign(newObj, obj);
                        //    }
                        //}
                        if (isOnSounds) {
                            var audio = new Audio("/blip.wav");
                            audio.play();
                            beepflag = false;
                        }
                       
                        users_and_rooms_names_arr.forEach(function (item, i) {
                            if (item === messFrom) {
                                users_and_rooms_names_arr.splice(i, 1);
                                users_and_rooms_names_arr.unshift(item);
                      
                            }
                        });
                        _badgeDic[messFrom] = _badgeDic[messFrom] + 1;  // add barge
                      //  users_and_rooms_names_arr = objUsersArr;
                    }
                    obj[messFrom].push(element);
                }
            }
             
        }) 
 
        //var copy = Object.assign({}, obj);


       
        // if (!isLoadStartMessagess) {
        //      fetchStartMessages().then(function (data) {
        //          data.forEach((m) => {
        //              var _imageastext = IsUrlAndImage(m.textmessage);
        //              var _youtubeastext = IsUrlAndYoutube(m.textmessage);
        //              var _videoastext = IsUrlAndMP4(m.textmessage);
        //              m.imageastext = _imageastext;
        //              m.youtubeastext = _youtubeastext;
        //              m.videoastext = _videoastext;
        //              obj["Home"].push(m);
        //          })
        //          setIsLoadStartMessagess(true);
        //     });
          
        // }
      for (let key in obj) {
          if (!users_and_rooms_names_arr.includes(key)) {
              //console.log("delete")
              // delete (obj[key]);

              objUsersArr.forEach(function (item, i) {
                  if (item == key) {
                      objUsersArr.splice(i, 1);
                  }
              })
              //if (index === -1) { alert(330) }


              obj[key] = [];
              if (activeTab === key) {
                  setActiveTab("Home");
              }
          }
      }
       
        
        setUsMes(obj);
        //   setUsersArr(usersArr.filter((name) => !usersToDelete.includes(name)));
        setUserBadge(_badgeDic);
        setUsersArr(users_and_rooms_names_arr);
      
      
        setLoading(true);
      
    }

   
 

 
 
   // function ghostLogin(){
        // fetch('https://localhost:7061/login/ghost').then(function(response) {
        //     return response.text().then(function(text) {
        //       setGhostName(text);
        //     });
        //   });
   // }

    useEffect(() => {
        
         
        setPublicMessages(publicMessagesInit);
        setPrivateMessages(privateMessagesInit);

    }, []);
    
    useEffect(()=>{
        let connect = new signalR.HubConnectionBuilder().withUrl("https://localhost:7061/chat?name=&sex=&isroom=false").withAutomaticReconnect().build()
        setConnection(connect);
      },[])
    
      useEffect(() => {
        if (connection) {

           

              connection.start().then(() => {
              connection.on("PrivateResponse", (message, fromwho) => {
                    const copy = privateMessages;
                    if( (message.forwho in copy) !== true){
                        copy[message.forwho] = [];
                    }
                     copy[message.forwho].push(message);
                     setPrivateMessages({...copy});
              });
              connection.on("PublicResponse", (message , fromwho) => {
                    const copy = publicMessages;
                    if( (message.room in copy) !== true){
                        copy[message.room] = [];
                    }
                    copy[message.room].push(message);
                    setPublicMessages({...copy});
              });

              connection.on("GhostLoginResponse", (userslist: IUsersContainer) => {
                console.log("");
               // setAllUsers({...userslist});
                dispatch({type: "toAdd", payload: userslist, keyToDelete: null});
              });

              connection.on("LoginNotifyGhost", (message, connectionid: string, user: IUserInfo ) => {
                
                     let key_value_pair = { };
               //   all_users[connection.connectionId] = {"connectionid":connection.connectionId,"name":connection.connectionId,"sex":"w", "isroom": false};
                     key_value_pair[user.name] = user;
               //     setAllUsers({...all_users});
               //   dispatch({type: "toAdd", payload: key_value_pair, keyToDelete: null});
               setMyName(connection.connectionId);
               connection.invoke("GettingUsersListOnce");

                //   if(!isMyConnectionDone){
                //       setMyName(connection.connectionId);
                //       connection.invoke("GettingUsersListOnce");
                //       console.log("");
                //   }
          
                  setNotify({user: message, showing: true});

                  setIsMyConnectionDone(true);
              
              });
              connection.on("Disconnect", (username: string) => {
                dispatch({type: "toRemove", payload: null, keyToDelete: username});
            //    let all_users =  allUsers;
            //    delete all_users[username];
           //     setAllUsers({...all_users});
                if(!isMyConnectionDone){
                    setMyName(connection.connectionId);
                }
        
              //  setNotify({user: message, showing: true});

                setIsMyConnectionDone(true);
            
            });
            }) 
            .catch((error) => console.log(error));
        }
      }, [connection ]);

    // if (!isLoading) {
    //     return (
    //         <div>
    //             <h1>Загрузка...</h1>
    //             <img src="https://hg1.funnyjunk.com/gifs/How+do+i+computer+i+decided+to+try+my+hands_81418e_4707807.gif"/>
    //         </div>
    //     );
    // } else {
        return (
            <UsersItems allUsers={allUsers} publicMessages={publicMessages} privateMessages={privateMessages} myName={myName} notify={notify} setNotify={setNotify} connection={connection} isOnSounds={isOnSounds} setIsOnSounds={setIsOnSounds} cookie={cookieName} usersArr={usersArr} secretRoomUsers={secretRoomUsers} roomsDic={roomsDic} showModal={showModal} setShowModal={setShowModal} notifWoman={notifWoman} notifMan={notifMan} setNotifWoman={setNotifWoman} setNotifMan={setNotifMan} enterUsers={enterUsers} setShow={setShow} show={show} usMes={usMes} activeTab={activeTab} setActiveTab={setActiveTab} usersSex={usersSex} usersBadge={usersBadge} setUserBadge={setUserBadge} messageText={messageText} setMessageText={setMessageText} /> 
        );
   // }
}


 
 

 
 
 

 