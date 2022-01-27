import React, { FC, useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { Modal, Form, Button, Spinner, Row, Col, Tab, Tabs } from 'react-bootstrap';
import Image from 'next/image';
import { getCookie, checkIsRoom } from '../Utils';
import $ from 'jquery';
import {IUsersContainer, IMessage_FOR_Server} from '../Interfaces';
//import ReactGiphySearchbox from 'react-giphy-searchbox';
import { DateTime } from './DateTime';
interface IRightSidebarProps{
    isOnImage: boolean;
    isOnSounds: boolean;
    isOnScroll: boolean;
    notifMan: boolean;
    notifWoman: boolean;
    activeTab: string;
    setIsOnImage: Dispatch<SetStateAction<boolean>>;
    setIsOnSounds: Dispatch<SetStateAction<boolean>>;
    setIsOnScroll: Dispatch<SetStateAction<boolean>>;
    setNotifMan: Dispatch<SetStateAction<boolean>>;
    setNotifWoman: Dispatch<SetStateAction<boolean>>;

    myNameRef: React.MutableRefObject<string>;
    audioToSend: React.MutableRefObject<string | null>;

    connectionId: string;
    listOfUsers: IUsersContainer;
    DoSendPhoto(url: string): void;
    DoSendAudio(url: string): void;
    setNotify: React.Dispatch<React.SetStateAction<{alert: string, showing: boolean }>>;
}


export const RightSidebar: FC<IRightSidebarProps> = (props) => {
 
    const [isSpinnerTurnOn, setSpinnerTurnOn] = useState(false);

    
    const imageHandler = () => {
        props.setIsOnImage(!props.isOnImage);
   
    }
    const soundHandler = () => {
        props.setIsOnSounds(!props.isOnSounds);
      
    }
    const scrollHandler = () => {
        props.setIsOnScroll(!props.isOnScroll);
   
    }
    const setNotifManHandler = () => {
        props.setNotifMan(!props.notifMan);
 
    }
    const setNotifWomanHandler = () => {
        props.setNotifWoman(!props.notifWoman);
 
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
     
    const onSelectTab = (e:any) => {
        setTabName(e);
    }
 
    function setPermission() {
        setIsPermission(true);
    }
 
    const [stream, setStream] = useState({
        access: false,
        recorder: null,
        error: ""
    });

    const [recording, setRecording] = useState({
        active: false,
        available: false,
        url: ""
    });
    const chunks = useRef([]);
    const onClickRecord = () => {
        if (!isSpinnerTurnOn) {
            stream.recorder.start()
            setSpinnerTurnOn(true);
        }
        else if (isSpinnerTurnOn) {
            stream.recorder.stop()
            setSpinnerTurnOn(false);
        }
    }
 
    function getAccess(props: IRightSidebarProps) {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((mic) => {
                let mediaRecorder;

                try {
                    mediaRecorder = new MediaRecorder(mic, {
                        mimeType: "audio/webm"
                    });
                } catch (err) {
                    console.log(err);
                }

                const track = mediaRecorder.stream.getTracks()[0];
                track.onended = () => console.log("ended");

                mediaRecorder.onstart = function () {
                    setRecording({
                        active: true,
                        available: false,
                        url: ""
                    });
                };

                mediaRecorder.ondataavailable = function (e) {
                    console.log("data available");
                    chunks.current.push(e.data);
                };

                mediaRecorder.onstop = async function () {
                    console.log("stopped");

                    const url = URL.createObjectURL(chunks.current[0]);

                    PostAudio(new Blob(chunks.current, { type: 'audio/x-mpeg-3' }), props);

                    chunks.current = [];

                    setRecording({
                        active: false,
                        available: true,
                        url
                    });
                };

                setStream({
                    ...stream,
                    access: true,
                    recorder: mediaRecorder
                });
            })
            .catch((error) => {
                props.setNotify({alert: error.message, showing: true});
                console.log(error);
                setStream({ ...stream, error });
            });
    }
    /////////////
    const onSendPhoto = () => {
        let files = (document.getElementById('files') as HTMLFormElement).files;
       
        let formData = new FormData();
        formData.append("files", files[0]);
        formData.append("fromwho", props.myNameRef.current);
        formData.append("forwho", props.activeTab);

        if(checkIsRoom(props.listOfUsers[props.activeTab])){
            formData.append("isroom", "true");
        }
        else{
            formData.append("isroom", "false");
        }

        formData.append("connectionid", props.connectionId);

        $.ajax(
            {
                dataType: 'text',
                url: "https://localhost:7061/UploadImage",
                enctype: "multipart/form-data",
                data: formData,
                processData: false,
                contentType: false,
                type: "post",
                success: function (response) {
                    let url = JSON.parse(response)['url'];
                    props.DoSendPhoto(url);

                    (document.getElementById("files") as HTMLFormElement).value = null;
                  
                },
                error: function ( ) {
                     alert("Ошибка загрузки фото. Возможно, размер превышает 5 мегабайт");
                    (document.getElementById("files") as HTMLFormElement).value = null;
                }
            }
        );

    }
 


    function PostAudio(blob: Blob, props: IRightSidebarProps) {

            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
            let base64toBlob = reader.result;
          
            props.DoSendAudio(String(base64toBlob));
        }
    }
    function b64toBlob(dataURI:string) {
        let byteString = atob(dataURI.split(',')[1]);
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'audio/x-mpeg-3' });
    }
    function switcherHandler() {
         
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
                  
                    <div className="columnsettings" id="csettings">
                        <div className="imageInput">
                            <Button style={{ width: 100 + 'px', height: 100 + 'px', float: "left", padding: 0}}>  
                            <label id="labelforimage" htmlFor="files" >
                            { 
                                <div style={{margin: 'auto', height:'50px', width:'50px', marginTop:'25px'}}>
                                    <Image src="/photo.png" width={50} height={50} alt=""/>
                                </div>
                            }
                                </label>
                            </Button>
                            <input id="files" hidden type="file" style={{ width: 100 + 'px', float: "left" }} onInput={onSendPhoto} accept="image/*" />
                        </div>

                        {stream.access ? (
                        <div>
                            <Button className="recordButton" variant="success" onClick={onClickRecord}> 
                              {isSpinnerTurnOn && (<><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /><p>Нажмите, чтобы закончить запись</p></>)}  
                              {!isSpinnerTurnOn && (<>Нажмите для записи</>)}  
                            </Button>
                        </div>
                        ):(
                            <Button className="recordButton" variant="primary" onClick={()=>getAccess(props)}> Разрешить доступ к микрофону </Button>
                        )}
                    
                    </div>
                    
                    <Form className="switchMenu">
                        <Form.Check checked={props.isOnSounds} type="switch" id="custom-switch1" label="Звуковые оповещения" onChange={soundHandler} />
                        <Form.Check checked={props.isOnImage} type="switch" id="custom-switch2" label="Картинки" onChange={imageHandler} />
                        <Form.Check checked={props.isOnScroll} type="switch" id="custom-switch3" label="Автоскролл" onChange={scrollHandler} />
                        <Form.Check checked={props.notifWoman} type="switch" id="custom-switch4" label="Уведомить если Ж зайдет в чат" onChange={setNotifWomanHandler} />
                        <Form.Check checked={props.notifMan} type="switch" id="custom-switch5" label="Уведомить если М зайдет в чат" onChange={setNotifManHandler} />
                    </Form>
                    {/* <CreateRoom secretRoomUsers={props.secretRoomUsers} /> */}
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
               
			    </Tab>
                </Tabs>
                </div>
               
            </div>
        </>
      
    );
};
 

const Li = (props:any) => {
    return (
        <li key={props.keyValue}><Image onClick={(e) => props.selectPornGif(e)} height={"auto"} width={285} alt=""  src={props.srcValue} /></li>
        );
}

const CreateRoom = (props:any) => {
    const [valueName, setValueName] = useState("");
    const [valuePass, setValuePass] = useState("");

    const handleInputName = (event:any) => {
        let val = event.target.value;
        setValueName(val);
         
    }
    const handleInputPass = (event:any) => {
        let val = event.target.value;
        setValuePass(val);
      
    }
     

    const handleSubmit = (event:any) => {
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