import React, { useEffect, useState, useRef, FC } from 'react';
import Image from 'next/image';
 
import { HubConnection } from "@microsoft/signalr";

interface ITextFieldSubmit
{
     DoSubmit: (event: React.FormEvent<HTMLFormElement>, textToSend: string) => void;
     textfieldRef: React.LegacyRef<HTMLInputElement>;
 
}
export const TextField:FC<ITextFieldSubmit> = (props) => {
    const [isShowEmoji, setShowEmoji] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [textfieldValue, setTextfieldValue] = useState<string>("");
    // const onEmojiClick = (event, emojiObject) => {
    //     var text = (document.getElementById("textfield")as HTMLFormElement).value;
    //     (document.getElementById("textfield") as HTMLFormElement).value = text + emojiObject.emoji;
    //     document.getElementById("textfield").focus();
    //    // document.getElementById("textfield").select();
    // };
   
    
 
 

 

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
            <form className="loginform" action="/Send" method="post" onSubmit={(e) => {props.DoSubmit(e, textfieldValue);  setTextfieldValue("");}}>
                <input ref={ props.textfieldRef } id="textfield" className="textfield" type="text" placeholder="" value={textfieldValue} onChange={(e)=> {setTextfieldValue(e.target.value)}} autoComplete="off" name="temp" style={{ paddingRight:'50px' }} required />
                <input className="sendbutton" type="submit" value="Send"   />
            </form>
        
               <label className="emojipicker" onClick={emojiClickHandler} >
                  <Image src="/smile.png" width={35} height={35}  alt="" className="image-emoji-picker" />
               </label>
       </div>
       {/* { isShowEmoji && (<Picker native={true} onEmojiClick={onEmojiClick} disableAutoFocus={true} preload={false} skinTone={SKIN_TONE_NEUTRAL} disableSearchBar={true} preload={false} pickerStyle={{ right: '0px', bottom: '50px', position: 'absolute' }} />)}*/}
    </>
        
       );
}