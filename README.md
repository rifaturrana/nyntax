# Instruction to run locally
To run the application locally, follow these steps:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/rifaturrana/nyntax.git
   ```

2. Navigate to the project directory:
   ```bash
   cd nyntax
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   or
      ```bash
   yarn
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

7. Access the application in your browser at `http://localhost:5173/` or you can visit ([NyntaxAssesment](https://nyntax-assesment.vercel.app/))

# Bonus Question:

#### Scenario:
Let's consider a Tesla in the system that charges $10 per hour and $50 per day. If the car is rented for six hours, the total cost using the hourly rate would be $60, which is more than the daily rate of $50.

#### Solution:
To handle this scenario, we can implement a logic to dynamically choose the most cost-effective pricing option based on the duration of the rental period. Here's how we can approach this:

1. **Hourly Rate**: If the rental period is less than 24 hours, calculate the cost using the hourly rate and take the min(hours*hourly rate,daily rate).
2. **Daily Rate**: If the rental period is 24 hours or more but less than 7 days, calculate the cost using the daily rate and take the min(days * daily rate, weekly rate)
3. **Weekly Rate**: If the rental period is 7 days or more, calculate the cost using the weekly rate.

A code snippet can be:
```bash
function calculateCost(durationWeeks, durationDays, durationHours, hourlyRate, dailyRate, weeklyRate) {
    if (durationHours * hourlyRate > dailyRate) {
        durationDays += 1; // Add an extra day
        durationHours = 0; // Reset hours
    }

    if (durationDays * dailyRate > weeklyRate) {
        durationWeeks += 1; // Add an extra week
        durationDays = 0; // Reset days
    }

    const totalCost = (durationWeeks * weeklyRate) + (durationDays * dailyRate) + (durationHours * hourlyRate);
    return totalCost;
}

const durationWeeks = 2;
const durationDays = 5;
const durationHours = 6;
const hourlyRate = 10; // $10 per hour
const dailyRate = 50;  // $50 per day
const weeklyRate = 300; // $300 per week

const cost = calculateCost(durationWeeks, durationDays, durationHours, hourlyRate, dailyRate, weeklyRate);
```



