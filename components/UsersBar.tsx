import React, { useEffect, useState } from 'react';
import { ToggleButton, Badge  } from 'react-bootstrap';
import{ Base64 } from '../Utils' ;
import 'react-image-lightbox/style.css';
 
import { TextField } from '../components/TextField';
 
import {ModalPrivateRoom} from './ModalPrivateRoom';
export const UsersBar = (props) => {
    const [isOnScroll, setIsOnScroll] = useState("");
    const [prevTab, setPrevTab] = useState(null);
    const [modalMessage, setModalMessage] = useState("Введите пароль");
    const [columnUsersCSS, setColumnUsersCSS] = useState({});
    const [startTouch, setStartTouch] = useState(0);

    const SendRequest = (gifUrl) => {
        var text = (document.getElementById("textfield") as HTMLFormElement).value;
        if (gifUrl != null) {
            text = gifUrl;
        }
            ( document.getElementById("textfield") as HTMLFormElement).value = "";
            ( document.getElementById("textfield") as HTMLFormElement).focus();
            ( document.getElementById("textfield") as HTMLFormElement).select();
    }
  
    
    function oncheckedHandler(e, tab) {
        props.setActiveTab(tab);
   }

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
        setColumnUsersCSS(onLeftCSS);
    }
    const changeSizeRightMenu = () => {
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
      
           <div className="columnusers" id="cleft" style={columnUsersCSS } >
               <ul id="users">
                   {
                       Object.keys(props.listOfUsers).map((name,i)=>{
                        return (
                            <li key={name} id={name}>
                                <ToggleButton
                                   // disabled={props.myName == name}
                                    disabled={props.myNameRef.current == name}
                                    id={`toggle-${name}`}
                                    className="leftUserName"
                                    type="checkbox"
                                    variant="outline-primary"
                                    checked={name === props.activeTab ? true : false}
                                    value={i}
                                    onChange={(e) => oncheckedHandler(e, name)}
                                    style={props.listOfUsers[name].sex === "w" ? womanCSS : manCSS} >
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
       );
}