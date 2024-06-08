import { useState } from 'react';
import Invoice from '../Invoice';
import './ReservationForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFetch } from '../../hooks/useFetch';
import { calculateCharges } from '../../utils/calculateCharges';

const ReservationForm = () => {
    const { vehicles, vehicleTypes } = useFetch(`${import.meta.env.VITE_API_URL}/carsList`);

    const [formData, setFormData] = useState({
        pickupDate: '',
        returnDate: '',
        duration: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        vehicleType: '',
        vehicle: '',
        collisionDamageWaiver: false,
        liabilityInsurance: false,
        rentalTax: false,
        discount: 0,
    });

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [durationUnits, setDurationUnits] = useState({ weeks: 0, days: 0, hours: 0 });



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'pickupDate' || name === 'returnDate') {
            const formattedDate = value.replace('T', ' ');
            setFormData(prevFormData => {
                const pickupDate = name === 'pickupDate' ? formattedDate : prevFormData.pickupDate;
                const returnDate = name === 'returnDate' ? formattedDate : prevFormData.returnDate;
                const diffTime = Math.abs(new Date(returnDate) - new Date(pickupDate));
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const weeks = Math.floor(diffDays / 7);
                const remainingDays = diffDays % 7;
                const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let duration = '';
                if (weeks > 0) {
                    duration += `${weeks} WEEK${weeks > 1 ? "S" : ""}`;
                }
                if (remainingDays > 0) {
                    duration += ` ${remainingDays} DAY${remainingDays > 1 ? "S" : ""}`;
                }
                if (hours > 0) {
                    duration += ` ${hours} HOUR${hours > 1 ? "S" : ""}`;
                }
                // Update duration state
                setDurationUnits({ weeks, days: remainingDays, hours });
                return {
                    ...prevFormData,
                    duration: duration.trim(),
                    [name]: formattedDate,
                };
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }

        if (name === 'vehicle') {
            const selected = vehicles?.find(vehicle => `${vehicle.make} ${vehicle.model}` === value);
            setSelectedVehicle(selected);
        }
    };



    const handleCalculateCharges = () => {
        return calculateCharges(formData, selectedVehicle, durationUnits);
    };

    const additionalCharges = [
        { name: 'Collision Damage Waiver', amount: 9.00, checked: formData.collisionDamageWaiver },
        { name: 'Liability Insurance', amount: 15.00, checked: formData.liabilityInsurance },
        { name: 'Rental Tax (11.5%)', amount: (selectedVehicle?.rates.hourly + selectedVehicle?.rates.daily + selectedVehicle?.rates.weekly) * 0.115, checked: formData.rentalTax },
    ];

    return (
        <div className="reservation-form container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Reservation</h1>
                <button className="btn btn-primary" onClick={() => setShowInvoice(true)}>Print / Download</button>
            </div>
            <form >
                <div className="row">
                    <div className="col-md-4">
                        <div className="section">
                            <h2>Reservation Details</h2>
                            <label>Reservation ID</label>
                            <input type="text" name="reservationId" className="form-control" onChange={handleChange} />
                            <label>Pickup Date*</label>
                            <input type="datetime-local" name="pickupDate" className="form-control" onChange={handleChange} required />
                            <label>Return Date*</label>
                            <input type="datetime-local" name="returnDate" className="form-control" onChange={handleChange} required />
                            <label>Duration</label>
                            <input type="text" name="duration" className="form-control" value={formData.duration} readOnly />
                            <label>Discount</label>
                            <input type="text" name="discount" className="form-control" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="section">
                            <h2>Customer Information</h2>
                            <label>First Name*</label>
                            <input type="text" name="firstName" className="form-control" onChange={handleChange} required />
                            <label>Last Name*</label>
                            <input type="text" name="lastName" className="form-control" onChange={handleChange} required />
                            <label>Email*</label>
                            <input type="email" name="email" className="form-control" onChange={handleChange} required />
                            <label>Phone*</label>
                            <input type="tel" name="phone" className="form-control" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="section charges-summary">
                            <h2>Charges Summary</h2>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>Charge</th>
                                        <th>Unit</th>
                                        <th>Rate</th>
                                        <th>Total</th>
                                    </tr>
                                    {durationUnits.weeks > 0 && (
                                        <tr>
                                            <td>Weekly</td>
                                            <td>{durationUnits.weeks}</td>
                                            <td>${selectedVehicle?.rates.weekly.toFixed(2)}</td>
                                            <td>${(durationUnits.weeks * selectedVehicle?.rates.weekly).toFixed(2)}</td>
                                        </tr>
                                    )}
                                    {durationUnits.days > 0 && (
                                        <tr>
                                            <td>Daily</td>
                                            <td>{durationUnits.days}</td>
                                            <td>${selectedVehicle?.rates.daily.toFixed(2)}</td>
                                            <td>${(durationUnits.days * selectedVehicle?.rates.daily).toFixed(2)}</td>
                                        </tr>
                                    )}
                                    {durationUnits.hours > 0 && (
                                        <tr>
                                            <td>Hourly</td>
                                            <td>{durationUnits.hours}</td>
                                            <td>${selectedVehicle?.rates.hourly.toFixed(2)}</td>
                                            <td>${(durationUnits.hours * selectedVehicle?.rates.hourly).toFixed(2)}</td>
                                        </tr>
                                    )}

                                    {additionalCharges.map(charge => (
                                        charge.checked && (
                                            <tr key={charge.name}>
                                                <td>{charge.name}</td>
                                                <td>1</td>
                                                <td>${charge.amount.toFixed(2)}</td>
                                                <td>${charge.amount.toFixed(2)}</td>
                                            </tr>
                                        )
                                    ))}

                                    <tr>
                                        <td>Total</td>
                                        <td colSpan="3">${handleCalculateCharges()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <div className="section">
                            <h2>Vehicle</h2>
                            <label>Vehicle Type*</label>
                            <select name="vehicleType" className="form-control" onChange={handleChange} required>
                                <option value="">Select Vehicle Type</option>
                                {vehicleTypes?.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                            <label>Vehicle*</label>
                            <select name="vehicle" className="form-control" onChange={handleChange} required>
                                <option value="">Select Vehicle</option>
                                {vehicles?.filter(vehicle => vehicle.type === formData.vehicleType).map((vehicle, index) => (
                                    <option key={index} value={`${vehicle?.make} ${vehicle?.model}`}>
                                        {vehicle?.make} {vehicle?.model}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="section">
                            <h2>Insurance Options</h2>
                            <label>
                                <input
                                    type="checkbox"
                                    name="collisionDamageWaiver"
                                    checked={formData.collisionDamageWaiver}
                                    onChange={handleChange}
                                /> Collision Damage Waiver
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="liabilityInsurance"
                                    checked={formData.liabilityInsurance}
                                    onChange={handleChange}
                                /> Liability Insurance
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="rentalTax"
                                    checked={formData.rentalTax}
                                    onChange={handleChange}
                                /> Rental Tax (11.5%)
                            </label>
                        </div>
                    </div>
                </div>

            </form>

            {showInvoice && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Invoice</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowInvoice(false)}></button>
                            </div>
                            <div className="modal-body">
                                <Invoice formData={formData} selectedVehicle={selectedVehicle} durationUnits={durationUnits} calculateCharges={handleCalculateCharges} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationForm;