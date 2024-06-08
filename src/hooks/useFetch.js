/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetch = (url) => {
    const [vehicles, setVehicles] = useState(null);
    const [error, setError] = useState(null);
    const [vehicleTypes, setVehicleTypes] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                const jsonData = response.data.data;
                setVehicles(jsonData);
                const types = Array.from(new Set(jsonData.map(vehicle => vehicle.type)));
                setVehicleTypes(types);
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, [url]);

    return { vehicles, error, vehicleTypes };
};
