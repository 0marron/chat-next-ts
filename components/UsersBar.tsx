import React, { useEffect, useState, FC } from 'react';
import { ToggleButton, Badge  } from 'react-bootstrap';
import{ Base64 } from '../Utils' ;
import 'react-image-lightbox/style.css';
 import{ IUsersContainer }from '../Interfaces';
import { TextField } from '../components/TextField';
 
import {ModalPrivateRoom} from './ModalPrivateRoom';
import { Style } from 'util';

interface IUsersBar{
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    activeTab: string;
}
interface IlistOfUsers{
    listOfUsers: IUsersContainer;
}
interface ImyNameRef {
    myNameRef: React.MutableRefObject<string>;
}
 
export const UsersBar: FC< IUsersBar & IlistOfUsers & ImyNameRef > = (props) => {
    const [isOnScroll, setIsOnScroll] = useState("");
    const [prevTab, setPrevTab] = useState(null);
    const [modalMessage, setModalMessage] = useState("Введите пароль");
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

 
    function onTap(event:any) {
        setStartTouch ( event.touches[0].clientX);
    }

    function moveTouch(event:any) {
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
    interface ICSSUsers{
        [index: string]: React.CSSProperties
    }
    
    const userCSS: ICSSUsers = {
        "w":{backgroundColor: "rgb(255, 182, 193)"},
        "m":{backgroundColor: "rgb(172, 194, 188)"},
        "r":{backgroundColor: "rgb(167, 140, 140)"}
    }
    const variantCSS:{[index: string]:string} = {
        "w":"outline-primary",
        "m":"outline-primary",
        "r": "outline-primary"
    }

    return (
      
           <div className="columnusers" id="cleft"  style={columnUsersCSS} >
               <ul id="users">
                   {
                       Object.keys(props.listOfUsers).map((name: string,i)=>{
                        return (
                            <li key={name} id={name} className="liuser">
                                <ToggleButton
                                    disabled={props.myNameRef.current == name}
                                    id={`toggle-${name}`}
                                    className="leftUserName"
                                    type="radio"
                                    variant={variantCSS[props.listOfUsers[name].sex]}
                                    checked={name === props.activeTab ? true : false}
                                    value={i}
                                    onChange={(e) => props.setActiveTab(name)}
                                    style={ userCSS[props.listOfUsers[name].sex] } >
                                 
                                 
                                    {Base64.decode(name)}
                                </ToggleButton>
                            </li>
                        );
                       })
                   }
               </ul>
           </div>
       );
}