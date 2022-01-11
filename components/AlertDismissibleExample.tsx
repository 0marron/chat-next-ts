import Iframe from 'react-iframe';
import Lightbox from 'react-image-lightbox';
import React, { useEffect, useState, useMemo, FC } from 'react';
import { Button, Alert, DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import {Base64, getCookie } from '../Utils'
export const AlertDismissibleExample: FC = (props : any) => {
    function islocalFunc(islocal: boolean) {
        if (islocal) {
            return true;
        } else {
            return false;
        } 
    }
    const colourWoman = {
        backgroundColor: "#FFB6C1"

    }
    const colourWhite = {
        backgroundColor: "rgb(255 255 255)"
         
    }
    const colourGreen = {
        backgroundColor: "rgb(172 194 188)"
    }
    function colourFunc(islocal: boolean) {
        if (islocal) {
            return colourWhite;
        } if (props.usersSex[props.fromwho] == "w") {
            return colourWoman;
        } if (props.usersSex[props.cookie] == "w" && islocal) {
            return colourWoman;
        } else {
            return colourGreen;
        }
    }
 
    var messageColour = useMemo(() => islocalFunc(props.islocal), []);
    var colour = useMemo(() => colourFunc(props.islocal), []);
 
    const [lightBoxState, setLightBoxState] = useState({ photoIndex: 0, isOpen: false });

 

    const cookieDecode = useMemo(() => Base64.decode(props.cookie), [])
    const fromwhoDecode = useMemo(() => Base64.decode(props.fromwho), [])
    const usernameDecode = useMemo(() => Base64.decode(props.username), [])


    const incomingAudio = useMemo(() => b64toBlob(props.audio), []);

    function b64toBlob(dataURI: string) {
        try {
            var byteString = atob(dataURI.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return URL.createObjectURL(new Blob([ab], { type: 'audio/x-mpeg-3' }));
        }
        catch {
            return null;
        }

    }

 

    function onSelectHandler(e: React.SyntheticEvent<HTMLElement, Event>, value: string) {
        props.setActiveTab(value);
      
    }
    function onClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: string) {
       
    }


    return (
      
            <div className="messagechat" style={colour}  >
                <div className={props.islocal ? "userchat-right" : "userchat-left" } >
                    {props.islocal && (
                        //<p>
                        //    {cookie} <span style={{ backgroundColor: "green" }}>▸</span>
                        //</p>
                        <Button variant="info"  className="message-name-button-right"> {props.usersSex[props.cookie] != undefined && <img src={props.usersSex[props.cookie] == "w" ? "./Sex-Female.png" : "./Sex-Male.png"} style={{ height: '20px', width: '20px' }} />}     {cookieDecode} </Button>
                    )}
                    {!props.islocal && props.fromwho != 'Home' && (
                        <>
                            <Button variant="info" className="message-name-button-left" onClick={(e) => onClickHandler(e, fromwhoDecode)}>   {props.usersSex[props.fromwho] != undefined && <img src={props.usersSex[props.fromwho] == "w" ? "./Sex-Female.png" : "./Sex-Male.png"} style={{ height: '20px', width: '20px' }} />} {fromwhoDecode} </Button>
                            <DropdownButton as={ButtonGroup} title=" " id="bg-vertical-dropdown-1">
                                <Dropdown.Item eventKey="1" onSelect={(e) => onSelectHandler(e, props.fromwho)} >Написать в приват</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Заблокировать</Dropdown.Item>
                            </DropdownButton>
                        </>
                    )}
                    {!props.islocal && props.fromwho === 'Home' && (
                        <div className="usName">
                            <Button variant="primary" onClick={(e) => onClickHandler(e, usernameDecode)}> {props.usersSex[props.username] != undefined && <img src={props.usersSex[props.username] == "w" ? "./Sex-Female.png" : "./Sex-Male.png"} style={{ height: '20px', width: '20px' }} />} {usernameDecode} </Button>
                            <DropdownButton as={ButtonGroup} title=" " id="bg-vertical-dropdown-1">
                                <Dropdown.Item eventKey="1" onSelect={(e) => onSelectHandler(e, props.username)} >Написать в приват</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Заблокировать</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    )}
                </div>

            
                <>
                        {!props.imageastext && !props.youtubeastext && (props.textmessage)}
                        {props.imageurl && props.isOnImage && (
                            <a className="imagechat" onClick={() => setLightBoxState({ photoIndex: 0, isOpen: true })}>
                        <img src={'./uploadImages/' + props.imageurl} style={{ height: 'auto', width: '200px', borderRadius: '1rem' }} />
                            </a>
                        )}
                        {props.imageastext && props.isOnImage && (
                    <a className="imagechat" onClick={() => setLightBoxState({ photoIndex: 0, isOpen: true })}>
                        <img src={props.textmessage} style={{ height: 'auto', width: '200px', borderRadius:'1rem' }} />
                            </a>
                        )}




                        {props.imageurl && !props.isOnImage && (
                            <a className="imagechat" onClick={() => setLightBoxState({ photoIndex: 0, isOpen: true })}>
                                <img src={'./hidescreener.png'} style={{ height: '30px' }} />
                            </a>
                        )}

                        {props.imageastext && !props.isOnImage && (
                            <a className="imagechat" onClick={() => setLightBoxState({ photoIndex: 0, isOpen: true })}>
                                <img src={'./hidescreener.png'} style={{ height: '30px' }} />
                            </a>
                        )}

                        {props.imageastext && lightBoxState.isOpen && (
                            <Lightbox
                                mainSrc={props.textmessage}
                                onCloseRequest={() => setLightBoxState({ photoIndex: 0, isOpen: false })}
                            />
                        )}
                       


                        {!props.imageastext && lightBoxState.isOpen && (
                            <Lightbox
                                mainSrc={'./uploadImages/' + props.imageurl}
                                onCloseRequest={() => setLightBoxState({ photoIndex: 0, isOpen: false })}
                            />
                        )
                        }



                        {props.youtubeastext && (
                        <iframe className="youtube" frameBorder={0} allowFullScreen={true} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"  src={props.youtubeastext} />
                        )}
                        { /*
                         
                             {props.videoastext && (
                            <video src={props.videoastext} autoplay muted playsinline preload="metadata" controls="controls" loop style={{ height: "auto", width: "300px" }}  >  </video>
                        )}
                         */}
                     

                        {
                            props.audio != null && props.islocal && (
                                <audio controls src={props.audio} />
                            )
                        }

                        {
                            props.audio !== null && !props.islocal &&   (
                                <audio controls src={incomingAudio} />
                            )
                        }
                </>

            

            </div>
        
    );


}
 