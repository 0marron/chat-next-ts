import React, { useState, useEffect, useRef } from 'react';
import { Tab, Tabs, Form, Button, Spinner } from 'react-bootstrap';

import { checkIsRoom } from '../Utils';
import $ from 'jquery';

let rec = null;

export const Settings = (props) => {
    //const [spinner, setSpinner] = useState(<Spinner />);
    const [isSpinnerTurnOn, setSpinnerTurnOn] = useState(false);

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
          //  setSpinner(<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />);
        }
        else if (isSpinnerTurnOn) {
            stream.recorder.stop()

            setSpinnerTurnOn(false);
           // setSpinner(<Spinner />);
        }


    }
    /////////////
    function getAccess(props) {
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

                    props.AddLocalMessage("", "", url, props.cookieName, props.activeTab, props.usMes)//Add local audio message with global obj
                     
                };

                setStream({
                    ...stream,
                    access: true,
                    recorder: mediaRecorder
                });
            })
            .catch((error) => {
                console.log(error);
                setStream({ ...stream, error });
            });
    }
    /////////////
    const onSendPhoto = () => {
        let isRoom: boolean = checkIsRoom(props.roomsDic, props.activeTab);
        let files = null;
      
          files = (document.getElementById('files') as HTMLFormElement).files;
       
        let formData = new FormData();
        formData.append("files", files[0]);
        formData.append("from", props.cookieName);
        formData.append('isThisRoom', String(isRoom));
        if (props.activeTab == "Home") {
            formData.append("to", "Home");
        }
        else {

            formData.append("to", props.activeTab);
        }
        $.ajax(
            {
                dataType: 'text',
                url: "/ChatPage/UploadImage",
                enctype: "multipart/form-data",
                data: formData,
                processData: false,
                contentType: false,
                type: "post",
                success: function (response) {
                    let url = JSON.parse(response)['url'];
                    props.AddLocalMessage(null,  url, null, props.cookieName, props.activeTab, props.usMes)//Add local image message with global obj
                 
                    (document.getElementById("files") as HTMLFormElement).value = null;
                  
                },
                error: function ( ) {
                    alert("Ошибка загрузки фото. Возможно, размер превышает 5 мегабайт");
                  
                    (document.getElementById("files") as HTMLFormElement).value = null;
                  
                }
            }
        );

    }
     
    function PostAudio(blob, props) {
        let isRoom = checkIsRoom(props.roomsDic, props.activeTab);
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            let base64toBlob = reader.result;
            let formData = new FormData();
            formData.append('audiofile', String(base64toBlob));
            formData.append('from', props.cookieName);
            formData.append('to', props.activeTab);
            formData.append('isThisRoom', String(isRoom));
             
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/ChatPage/UAudio', true);
            xhr.onload = function (e) {
                if (this.status == 200) {
                    
                     //  let downloadUrl = URL.createObjectURL(b64toBlob(this.response));

                      //  props.AddLocalMessage("", "", recording.url, props.cookieName, props.activeTab, props.usMes)//Add local image message with global obj
  
                } else {
                    alert('Unable to download excel.')
                }
            };
            xhr.send(formData);
        }
    }
    function b64toBlob(dataURI) {
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
        <div className="columnsettings" id="csettings">
 
            <div className="imageInput">
                <Button style={{ width: 100 + 'px', height: 100 + 'px', float: "left" }}>  
                <label id="labelforimage" title="❤Отправить фото❤" style={{ float: "left" }} htmlFor="files" >
                    {/* <img src="./uploadimg.png" style={{ width: 100 + 'px', height: 100 + 'px'  }} /> */}
                    </label>
                </Button>
                <input id="files" hidden type="file" style={{ width: 100 + 'px', float: "left" }} onInput={onSendPhoto} accept="image/*" />
            </div>
 
                {stream.access ? (
                <div>
                    <Button className="recordButton" variant="primary" onClick={onClickRecord}>  REC... </Button>
                </div>
 
                 ):(
                    <Button className="recordButton" variant="primary" onClick={()=>getAccess(props)}> Голосовое сообщение </Button>
                )}
             
        </div>
        );
}

 