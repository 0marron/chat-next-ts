import React, { FC } from 'react';
import { Toast } from 'react-bootstrap';
interface INotifyBadge{
    notify: {
        user: string;
        showing: boolean;
    },
    setNotify: React.Dispatch<React.SetStateAction<{
        user: string;
        showing: boolean;
    }>>
}
export const  NotifyBadge: FC<INotifyBadge> = (props) =>{
    return(
        <div
        aria-live="polite"
        aria-atomic="true"
        style={{
            position: 'absolute',
            height: '50px',
            top: 2,
            right: 2
        }}
       >
         {props.notify.showing &&
         <Toast onClose={() => props.setNotify({user:"", showing: false})} show={props.notify.showing} delay={3000} autohide>
             <Toast.Body>В чат заходит:   { props.notify.user } </Toast.Body>
         </Toast>}
       </div>
    )
}

 