import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Form, Button, Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
 
import { Settings } from './Settings';
import { getCookie } from '../Utils';
import Cookies from 'universal-cookie';
//import ReactGiphySearchbox from 'react-giphy-searchbox';
import { DateTime } from '../components/DateTime';

export const Sidebar = (props) => {
    const setCookie = (name, value) => {
        const cookies = new Cookies();
        const current = new Date();
        const nextYear = new Date();
 
        nextYear.setFullYear(current.getFullYear() + 1);
        cookies.set(name, { key: value }, { path: '/', expires: nextYear });
    }


    
    const imageHandler = () => {
        props.setIsOnImage(!props.isOnImage);
        setCookie("ImagesCookie", !props.isOnImage);
    }
    const soundHandler = () => {
        props.setIsOnSounds(!props.isOnSounds);
        setCookie("SoundsCookie", !props.isOnSounds);
    }
    const scrollHandler = () => {
        props.setIsOnScroll(!props.isOnScroll);
        setCookie("ScrollCookie", !props.isOnScroll);
    }
    const setNotifManHandler = () => {
        props.setNotifMan(!props.notifMan);
        setCookie("NotifMCookie", !props.notifMan);
    }
    const setNotifWomanHandler = () => {
        props.setNotifWoman(!props.notifWoman);
        setCookie("NotifWCookie", !props.notifWoman);
    }

    const selectGif = (item)=> {
        console.log(item)

        let url = item.images.original.url;
        if (url != null && isPermission) {
            props.sendRequest(url);
        }
        
        setIsShowSlider(false);
    }
    const selectPornGif = (e) => {

        if (props.activeTab === "Home") {
            return;
        }
        let url = e.currentTarget.currentSrc;
        if (url != null) {
            props.sendRequest(url);
        }
        setIsShowSlider(false);
    }
    const [isShowSlider, setIsShowSlider] = useState(false);
    const slidebarClose = {
       
        transition: "transform .5s ease" ,
        transform: "translateX(100%)",
        webkiTransform: "translateX(100%)" 
    }
    const slidebarOpen = {
      
        transition: "transform .5s ease",
        transform: "translateX(0%)",
        webkiTransform: "translateX(0%)"
    }

   
    const [tabName, setTabName] = useState("home");
    const [isPermission, setIsPermission] = useState(true);
     
   
    const [pornImages, setPornImages] = useState([]);

    useEffect(() => {
        let initArr = [getRandomInt(37998), getRandomInt(37998), getRandomInt(37998), getRandomInt(37998), getRandomInt(37998)];
        setPornImages(initArr);
    }, [])

    const scrollEvent = () => {
        console.log("scroll");
        let elem = null;
       
        if (elem.scrollTop >= (elem.scrollHeight - elem.offsetHeight)) {
            elem.scrollTop = elem.scrollHeight;
            let imageSrc = getRandomInt(37998);
            setPornImages([...pornImages, imageSrc]);
        }
    }
     
    const onSelectTab = (e) => {
        setTabName(e);
    }


    function getRandomInt(max) {
        return "https://s3-us-west-1.amazonaws.com/porngifs/img/" + Math.floor(Math.random() * max);
    }
     
    function setPermission() {
        setIsPermission(true);
    }
 
    return (
     
          <>

       
            <div className="w3-sidebar" id="rightMenu" style={isShowSlider ? slidebarOpen : slidebarClose}>
                <div className="sliderBody">
                    <div className="showSliderButton">
                        <button className="w3-button" onClick={() => setIsShowSlider(!isShowSlider)}  >&#9776;</button>
                    </div>
                <Tabs id="controlled-tab-example" activeKey={tabName} onSelect={e => onSelectTab(e)}>
                  <Tab eventKey="home" title="Settings" style={{ height: '100%',   backgroundColor: '#a8a087' }}>
                    <Settings key={props.activeTab} {...props} />
                    <Form className="switchMenu">
                        <Form.Check checked={props.isOnSounds} type="switch" id="custom-switch1" label="Звуковые оповещения" onChange={soundHandler} />
                        <Form.Check checked={props.isOnImage} type="switch" id="custom-switch2" label="Картинки" onChange={imageHandler} />
                        <Form.Check checked={props.isOnScroll} type="switch" id="custom-switch3" label="Автоскролл" onChange={scrollHandler} />
                        <Form.Check checked={props.notifWoman} type="switch" id="custom-switch4" label="Уведомить если Ж зайдет в чат" onChange={setNotifWomanHandler} />
                        <Form.Check checked={props.notifMan} type="switch" id="custom-switch5" label="Уведомить если М зайдет в чат" onChange={setNotifManHandler} />
                    </Form>
                    <CreateRoom secretRoomUsers={props.secretRoomUsers} />
                </Tab>
                <Tab eventKey="profile" title="Gifs" style={{ height: '100%', backgroundColor: '#a8a087' }}>
                    {/* 
                    <ReactGiphySearchbox
                        gifListHeight= "430px"
                        imageRenditionFileType="webp"
                        searchPlaceholder="Search for Stickers"
                        apiKey="9Ixlv3DWC1biJRI57RanyL7RTbfzz0o7"
                        onSelect={item => selectGif(item)}
                        masonryConfig={[
                            {   gifPerPage: 5, mq: '8', columns: 2, imageWidth: 150, gutter: 1 },
                        ]}
                    />
                    */}
                </Tab>
                <Tab eventKey="contact" title="Gifs18+" style={{ height: '100%', backgroundColor: '#a8a087' }}>
                        <div className='pornImages' onScroll={scrollEvent} style={{ height: '500px', width: '300px', overflow: 'auto', overflowY: 'visible' }}>
                            <ul>
                                {
                                    pornImages.map(function (item, i) {
                                        return (<Li key={i} keyValue={i} srcValue={item} sendRequest={props.sendRequest} selectPornGif={selectPornGif} />);
                                    })
                                }
                            </ul>
                        </div>
			    </Tab>
                </Tabs>
                </div>
               
            </div>
        </>
      
    );
};
 

const Li = (props) => {
    return (
        <li key={props.keyValue}><img onClick={(e) => props.selectPornGif(e)} style={{ height: 'auto', width: '285px' }} src={props.srcValue} /></li>
        );
}

const CreateRoom = (props) => {
    const [valueName, setValueName] = useState("");
    const [valuePass, setValuePass] = useState("");

    const handleInputName = (event) => {
        let val = event.target.value;
        setValueName(val);
         
    }
    const handleInputPass = (event) => {
        let val = event.target.value;
        setValuePass(val);
      
    }
     

    const handleSubmit = (event) => {
        event.preventDefault();
        var cookieName = getCookie("Session");

        if (valueName in props.secretRoomUsers) {
            if (props.secretRoomUsers[valueName].includes(cookieName)) {
                //пользователь уже есть в этой комнате.
                alert("Уже авторизован");
                return false;
            }
        }

        fetch('/ChatPage/CreateRoom',
            {
                method: 'POST',
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomName: valueName,
                    creator: cookieName,
                    password: valuePass

                })
            })
            .then(response => {
                if (response.ok == true) {
                   
                }
            });
      
    };
    
    return (
        <Form onSubmit={handleSubmit} className="createRoomhMenu" >
             
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Создать групповую комнату</Form.Label>
                <Form.Control onChange={handleInputName} type="text" value={valueName}  placeholder="Название комнаты" />
            
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Control onChange={handleInputPass} type="text" value={valuePass}  placeholder="Пароль (если нужно)" />
            </Form.Group>
            
            <Button variant="primary" type="submit" className ="roomCreateButton">
                Создать комнату
            </Button>
        </Form>
    );
}