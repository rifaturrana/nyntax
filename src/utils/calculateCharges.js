export const calculateCharges = (formData, selectedVehicle, durationUnits) => {
    if (!selectedVehicle) return '0.00';

    const hourlyRate = selectedVehicle.rates.hourly;
    const dailyRate = selectedVehicle.rates.daily;
    const weeklyRate = selectedVehicle.rates.weekly;
    let total = 0;

    // Use duration units from state
    const { weeks, days, hours } = durationUnits;

    // Calculate charges
    total += weeks * weeklyRate;
    total += days * dailyRate;
    total += hours * hourlyRate;

    // Add additional charges
    if (formData.collisionDamageWaiver) total += 9;
    if (formData.liabilityInsurance) total += 15;
    if (formData.rentalTax) total += total * 0.115;
    if (formData.discount) {
        total -= parseFloat(formData.discount);
    }

    return total.toFixed(2);
};