// new file called DogPicture.jsx
import * as React from 'react'
import { useEffect, useState } from 'react';
import { info } from '../../services/log';

const DogPicture = (message) => {
    const [imageUrl, setImageUrl] = useState('');
    info("DogPicture:", message);
    useEffect(() => {
        fetch('https://dog.ceo/api/breeds/image/random')
            .then((res) => res.json())
            .then((data) => {
                setImageUrl(data.message);
            });
    }, []);

    return (
        <div>
            <img src={imageUrl} alt='a dog' />
        </div>
    );
};

export default DogPicture;