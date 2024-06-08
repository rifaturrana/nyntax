import React from 'react';
import { useReactToPrint } from 'react-to-print';
/* eslint-disable react/prop-types */
const Invoice = ({ formData, selectedVehicle, durationUnits, calculateCharges }) => {
    const invoiceRef = React.useRef();

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
    });

    return (
        <><div className="invoice" ref={invoiceRef}>
            <h2>Invoice</h2>
            <div>
                <p><strong>Customer:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Vehicle:</strong> {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})` : 'Not selected'}</p>
            </div>
            <div>
                <p><strong>Pickup Date:</strong> {formData.pickupDate}</p>
                <p><strong>Return Date:</strong> {formData.returnDate}</p>
            </div>
            <div>
                <h3>Charges Summary</h3>
                {durationUnits.weeks > 0 && <p>Weekly: ${selectedVehicle ? selectedVehicle.rates.weekly.toFixed(2) * durationUnits.weeks : '0.00'}</p>}
                {durationUnits.days > 0 && <p>Daily: ${selectedVehicle ? selectedVehicle.rates.daily.toFixed(2) * durationUnits.days : '0.00'}</p>}
                {durationUnits.hours > 0 && <p>Hourly: ${selectedVehicle ? selectedVehicle.rates.hourly.toFixed(2) * durationUnits.hours : '0.00'}</p>}
                {formData.collisionDamageWaiver && <p>Collision Damage Waiver: $9.00</p>}
                {formData.liabilityInsurance && <p>Liability Insurance: $15.00</p>}
                {formData.rentalTax && <p>Rental Tax (11.5%): ${(calculateCharges() * 0.115).toFixed(2)}</p>}
                <h4>Total: ${calculateCharges()}</h4>
            </div>
        </div><button onClick={handlePrint}>Print / Download Invoice</button></>

    );
};

export default Invoice;
