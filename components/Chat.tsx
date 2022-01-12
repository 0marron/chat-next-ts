import React, { useEffect, useState, useMemo } from 'react';
 
import{IsUrlAndImage, IsUrlAndMP4,IsUrlAndYoutube, isNullOrEmpty, getCookie, Base64, checkIsRoom} from '../Utils' ;
import 'react-image-lightbox/style.css';
import { UsersItems } from '../components/UsersItems';
import * as signalR from '@microsoft/signalr';
 import { IMessage_FROM_Server } from '../Interfaces';
 
 

export const Chat  = () => {
 
    const [usMes, setUsMes] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [usersSex, setUserSex] = useState({});
    const [usersBadge, setUserBadge] = useState({});
    const [activeTab, setActiveTab] = useState('Home');
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

    interface IUsersContainer{
        [key: string]:{ isman: boolean}
    }
    interface IMessagesContainer{
        [key: string]: IMessage_FROM_Server
    }

    const users: IUsersContainer = {
        "Коля":{"isman":true},
    }

    const privateMessages: IMessagesContainer = {
        "Коля":{
            textmessage: "",
            imageurl: "",
            fromwho:"",
            forwho: "",
            audio: "",
            room: "",
            imageastext: "",
            youtubeastext: "",
            videoastext: "",
            videofile: null,
            imagefile: null,
        },
    }

    const publicMessages: IMessagesContainer = {
        "Home":{
            textmessage: "",
            imageurl: "",
            fromwho:"",
            forwho: "",
            audio: "",
            room: "",
            imageastext: "",
            youtubeastext: "",
            videoastext: "",
            videofile: null,
            imagefile: null,
        }
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

   
 

    function PingRequest() {
        let data = JSON.parse( "{\"userlist\":[{\"name\":\"7072696E636573735F6F665F666F72657374\",\"sex\":\"w\"},{\"name\":\"4F76657272756E\",\"sex\":\"w\"},{\"name\":\"7369676D616D\",\"sex\":\"w\"},{\"name\":\"6F6C617361736861\",\"sex\":\"w\"},{\"name\":\"50696563655F6F665F7361646E657373\",\"sex\":\"w\"},{\"name\":\"73696C656E745F73637265616D\",\"sex\":\"w\"},{\"name\":\"70696F6E696573\",\"sex\":\"w\"},{\"name\":\"73616420476F6C656D\",\"sex\":\"w\"},{\"name\":\"6E6F72746820726F7365\",\"sex\":\"w\"},{\"name\":\"70696E6B20616E67656C\",\"sex\":\"w\"},{\"name\":\"524F4441\",\"sex\":\"w\"},{\"name\":\"5361646C79204D61646C79\",\"sex\":\"w\"},{\"name\":\"50657266656B746F4D6172696F\",\"sex\":\"w\"},{\"name\":\"50756E696373\",\"sex\":\"w\"},{\"name\":\"73656E74696E656C657365\",\"sex\":\"w\"},{\"name\":\"73696C656E7420736F756C\",\"sex\":\"w\"},{\"name\":\"526F73735F46616C636F6E65\",\"sex\":\"w\"},{\"name\":\"70697069\",\"sex\":\"w\"},{\"name\":\"506C616E6574205361646E657373\",\"sex\":\"w\"},{\"name\":\"6F6E6C795F796F75\",\"sex\":\"w\"},{\"name\":\"496E73616E697479\",\"sex\":\"m\"},{\"name\":\"4D69646173\",\"sex\":\"m\"},{\"name\":\"6D6F6F6E2D6D69737472657373\",\"sex\":\"m\"},{\"name\":\"4B59246D496348\",\"sex\":\"m\"},{\"name\":\"4C6F73744368616E6365\",\"sex\":\"m\"},{\"name\":\"676E66676E\",\"sex\":\"m\"},{\"name\":\"4865617274736F7265\",\"sex\":\"m\"},{\"name\":\"68656C6C6F5F62756E6E79\",\"sex\":\"m\"},{\"name\":\"6C6164795F76616D70\",\"sex\":\"m\"},{\"name\":\"6A7573745F73637265616D\",\"sex\":\"m\"},{\"name\":\"4974616C69616E506C756D626572\",\"sex\":\"m\"},{\"name\":\"4A7573745F66756E6B\",\"sex\":\"m\"},{\"name\":\"4D6172696C796E2048656C6C6F\",\"sex\":\"m\"},{\"name\":\"4D72732E536D69747479\",\"sex\":\"m\"},{\"name\":\"4C6F6E656C7920776F6C66\",\"sex\":\"m\"},{\"name\":\"6D69737472657373206F662074686520736F756C\",\"sex\":\"m\"},{\"name\":\"6E6963655F6375726C73\",\"sex\":\"m\"},{\"name\":\"4B61746520526F7373656C\",\"sex\":\"m\"}],\"messages\":[],\"publicrooms\":[{\"roomname\":\"Home\"}],\"secretrooms\":[]}" )  
        dataHandler(data);
        return;
       // var curName = getCookie("Session");
        // if (cookieName == undefined) {
        //     document.location.href = "https://chatmenow.ru/";
        //     return false;
        // }
      //  const Fp = document.getElementById("finger").value;
        fetch('/ChatPage/Ping',
            {
                method: 'POST',
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    cookieName: cookieName,
                    fp: "Fp",
                    groupRooms: ""
                })

            }).then(response => {
                if (response.ok == true) {
                    
                    console.log(response.status);
                   
                    setPingAttempts(0);
                   
                } else {
                   
                    setPingAttempts(pingAttempts + 1);
                    // if (pingAttempts == 10) {
                    //     document.location.href = "https://chatmenow.ru/";
                    // }
                    console.log(response.status);
                }
                return response.json();
            }).then(function (data) {
                 dataHandler(data);
            }).catch(function (error) {
                setPingAttempts(pingAttempts + 10);
                // if (pingAttempts == 3) {
                //     document.location.href = "https://chatmenow.ru/";
                // }
            
                console.log(error);
            });
    }
 
   // function ghostLogin(){
        // fetch('https://localhost:7061/login/ghost').then(function(response) {
        //     return response.text().then(function(text) {
        //       setGhostName(text);
        //     });
        //   });
   // }

    useEffect(() => {
    //    ghostLogin();
        PingRequest();
    }, []);
    
    useEffect(()=>{
        let connect = new signalR.HubConnectionBuilder().withUrl("https://localhost:7061/chat").build()
        setConnection(connect);
      },[])
    
      useEffect(() => {
        if (connection) {
           connection.start().then(() => {
              connection.on("PrivateResponse", (message, fromwho) => {
                    console.log(message);  
              });
              connection.on("PublicResponse", (message , fromwho) => {
                    console.log(message);  
              });
              connection.on("LoginNotify", (message: string) => {
                  setMyName(connection.connectionId);
                  setNotify({user: message, showing: true});
                console.log(message);  
              });
            }) 
            .catch((error) => console.log(error));
        }
      }, [connection]);

    if (!isLoading) {
        return (
            <div>
                <h1>Загрузка...</h1>
                <img src="https://hg1.funnyjunk.com/gifs/How+do+i+computer+i+decided+to+try+my+hands_81418e_4707807.gif"/>
            </div>
        );
    } else {
        return (
            <UsersItems myName={myName} notify={notify} setNotify={setNotify} connection={connection} isOnSounds={isOnSounds} setIsOnSounds={setIsOnSounds} cookie={cookieName} usersArr={usersArr} secretRoomUsers={secretRoomUsers} roomsDic={roomsDic} showModal={showModal} setShowModal={setShowModal} notifWoman={notifWoman} notifMan={notifMan} setNotifWoman={setNotifWoman} setNotifMan={setNotifMan} enterUsers={enterUsers} setShow={setShow} show={show} usMes={usMes} activeTab={activeTab} setActiveTab={setActiveTab} usersSex={usersSex} usersBadge={usersBadge} setUserBadge={setUserBadge} messageText={messageText} setMessageText={setMessageText} /> 
        );
    }
}


 
 

 
 
 

 