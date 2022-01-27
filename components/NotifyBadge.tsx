import React, { FC } from 'react';
import { Toast } from 'react-bootstrap';
interface INotifyBadge{
    notify: {
        alert: string;
        showing: boolean;
    },
    setNotify: React.Dispatch<React.SetStateAction<{
        alert: string;
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
         <Toast onClose={() => props.setNotify({alert:"", showing: false})} show={props.notify.showing} delay={3000} autohide>
             <Toast.Body> { props.notify.alert } </Toast.Body>
         </Toast>}
       </div>
    )
}

 