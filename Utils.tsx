
import React, { useState, useEffect, useRef } from 'react';
import {IMessage_FOR_Server, IUserInfo} from './Interfaces';

export const Base64 = {
    decode: function (hex: string) {
        try {
            var str = decodeURIComponent(hex.replace(/(..)/g, '%$1'))
        }
        catch (e) {
            str = hex
            
        }
        return str;
    },
    encode: function (str: string) {
        try {
            var hex = unescape(encodeURIComponent(str))
                .split('').map(function (v) {
                    return v.charCodeAt(0).toString(16)
                }).join('')
        }
        catch (e) {
            hex = str
            console.log('invalid text input: ' + str)
        }
        return hex;
    }
}
export const getCookie = (name: string)=> {
    if (typeof window !== "undefined") {
        let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    return null;
}
export const GetTime = () => {
    var date = new Date();
    return date.getHours() + ":" + date.getMinutes();
}
export const IsUrlAndYoutube = (url: string) => {
    if (url === null) {
        return false;
    }
    if (url === null) {
        return null;
    }
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    var id = match && match[7].length == 11 ? match[7] : null;
    if (id !== null) {
        var result = "https://www.youtube.com/embed/" + id;
        return result;
    } else {
        return null;
    }

}
export const IsUrlAndImage = (str: string) => {
    if (str === null) {
        return false;
    }
    if (str.includes("giphy.com")) {
        return true;
    }
    if (str.includes("https://s3-us-west-1.amazonaws.com/porngifs/img/")) {
        return true;
    }
   
    if (str === null) {
        return false;
    }

    var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    var regex = new RegExp(expression);

    if (str.match(regex)) {

        var parts = str.split('.');
        var extension = parts[parts.length - 1];
        var imageTypes = ['jpg', 'jpeg', 'tiff', 'png', 'gif', 'bmp']
        if (imageTypes.indexOf(extension) !== -1) {
            return true;
        }

        else {
            return false;
        }
    } else {
        return false;
    }
}
export const UrlSepar = (input: string  ) => {
    let urlRegex: RegExp = /(https?:\/\/[^ ]*)/;
    let match: RegExpMatchArray | null = input.match(urlRegex) ;
        if(match !== null){
            return match[1];
        }
        else{
            return null;
        }
}
export const IsUrlAndMP4 = (str:string) => {
    if (str === null) {
        return false;
    }
   
    let expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    let regex = new RegExp(expression);

    if (str.match(regex)) {

        let parts = str.split('.');
        let extension = parts[parts.length - 1];
        let imageTypes = ['mp4']
        if (imageTypes.indexOf(extension) !== -1) {
            return true;
        }
    } else {
        return false;
    }
}
export const checkIsRoom = ( recipient: IUserInfo ) => {
    if(!recipient){
         throw new Error(">IUserInfo< object is null or undefined");
    }
    if (recipient.isroom) {
       return true;
   } else {
       return false;
   }
}
export const isNullOrEmpty = (value: string) => {
    return (!value || value == undefined || value == "" || value.length == 0);
}
export const useInterval = (callback: any, delay: number) => {

    const savedCallback: any = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);


    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
 
export const MessageValidator = (value: string)=>  {
    let Message: IMessage_FOR_Server = {
        textmessage: null,
        imageurl: null,
        fromwho: null,
        forwho: null,
        audio: null,
        room: null,
        imageastext: null,
        youtubeastext: null,
        videoastext: null,
        videofile: null,
        imagefile: null
     }

    if(IsUrlAndImage(value)) {
        Message.imageurl = value;
        return Message;
    }
    if(IsUrlAndMP4(value)) {
        Message.videoastext = value;
        return Message;
    }
    if(IsUrlAndYoutube(value)) {
        Message.youtubeastext = value;
        return Message;
    }
    if(!isNullOrEmpty(value)){
        Message.textmessage = value
    }
    return Message;
  }