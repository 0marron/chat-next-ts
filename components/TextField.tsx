import React, { useEffect, useState, useMemo } from 'react';
 
 
import { HubConnection } from "@microsoft/signalr";

export const TextField = (props) => {
    const [isShowEmoji, setShowEmoji] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [textToSend, setTextToSend] = useState<string>("");
    const onEmojiClick = (event, emojiObject) => {
        var text = (document.getElementById("textfield")as HTMLFormElement).value;
        (document.getElementById("textfield") as HTMLFormElement).value = text + emojiObject.emoji;
        document.getElementById("textfield").focus();
       // document.getElementById("textfield").select();
    };
   
    
 
 

 

    const emojiClickHandler = () => {
        setShowEmoji(!isShowEmoji);
        ( document.getElementById("textfield") as HTMLFormElement).focus();
        ( document.getElementById("textfield") as HTMLFormElement).select();
    }
    const openRightMenu = () => {
        if (document.getElementById("rightMenu").style.display == "block") {
            document.getElementById("rightMenu").style.display = "none";
        } else {
            document.getElementById("rightMenu").style.display = "block";
        }
    }

    const closeRightMenu = () => {
        document.getElementById("rightMenu").style.display = "none";
    }
   return (
    <>
       <div className="underchat">
            <form className="loginform" action="/Send" method="post" onSubmit={(e) => props.DoSubmit(e, textToSend)}>
                <input id="textfield" className="textfield" type="text" placeholder="" value={textToSend} onChange={(e)=> {setTextToSend(e.target.value)}} autoComplete="off" name="temp" style={{ paddingRight:'50px' }} required />
                <input className="sendbutton" type="submit" value="Send"   />
            </form>
        
               <label id="emojipicker" onClick={emojiClickHandler} >
                  <img src="./smile.png" style={{ width: 35 + 'px', height: 35 + 'px', marginLeft: '7.5px', marginTop: '7.5px', marginBottom: '7.5px', marginRight: '7.5px', display: 'block' }} />
               </label>
       </div>
       {/* { isShowEmoji && (<Picker native={true} onEmojiClick={onEmojiClick} disableAutoFocus={true} preload={false} skinTone={SKIN_TONE_NEUTRAL} disableSearchBar={true} preload={false} pickerStyle={{ right: '0px', bottom: '50px', position: 'absolute' }} />)}*/}
    </>
        
       );
}