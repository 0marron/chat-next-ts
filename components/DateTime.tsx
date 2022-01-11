import React, { useMemo, useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
export const DateTime = () => {
    let date = new Date().toISOString().
        replace(/T/, ' ').
        replace(/\..+/, '');   

    const [timeLeft, setTimeLeft] = useState(date);

    function headerTime() {
        let date = new Date().toISOString().
                          replace(/T/, ' ').
                        replace(/\..+/, '');    

        return date;
    }
    useEffect(() => {
        setInterval(function () { setTimeLeft(headerTime())}, 1000);
    }, []);


    return (
        <div className="date-time">
            <div style={{ height: "33.5px", margin: '0 0 0 0', verticalAlign: 'middle', padding: '0.55rem 1.25rem' }}  >
                {timeLeft}
            </div>
           
        </div>
        );
}