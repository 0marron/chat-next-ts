import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

export const ModalPrivateRoom = (props: any) => {
    const [valuePass, setValuePass] = useState(null);
     

    const handleInputPass = (event: any) => {
        let val = event.target.value;
        setValuePass(val);

    }
    const onClose = () => {
        props.setShow(false);
        props.setActiveTab(props.prevTab);
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
    
        fetch('/ChatPage/LoginRoom',
            {
                method: 'POST',
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomName: props.activeTab,
                    userName: props.userName,
                    roomPass: valuePass
                })
            })
            .then(response => {
                if (response.ok == true) {
                   
                }
                return response.json();
                 
            }).then(function (data) {
                props.setModalMessage(data);
            })

    }

    return (
        <>
            <Modal show={props.show} onHide={onClose} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.modalMessage}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control onChange={handleInputPass} type="password" value={valuePass} placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit" >
                        Enter
                    </Button>
                </Form>
            </Modal>
        </>
    );
}

 