
export interface IMessage_FOR_Server{
    textmessage: string|null;
    imageurl: string|null;
    fromwho: string|null;
    forwho: string|null;
    audio: string|null;
    room: string|null;
    imageastext: string|null;
    youtubeastext: string|null;
    videoastext: string|null;
    videofile: null;
    imagefile: null;
}

export interface IMessage_FROM_Server{
    textmessage: string|null;
    imageurl: string|null;
    fromwho: string|null;
    forwho: string|null;
    audio: string|null;
    room: string|null;
    imageastext: string|null;
    youtubeastext: string|null;
    videoastext: string|null;
    videofile: null;
    imagefile: null;
}
export interface IUsersContainer{
    [key: string]:IUserInfo
}
export interface IRoomsContainer{
    [key: string]:{ sex: string}
}
 
export interface IMessagesContainer{
    [key: string]: IMessage_FROM_Server[]
}

export interface IUserInfo{
    connectionid: string;
    name: string;
    sex: string;
    isroom: boolean;
}