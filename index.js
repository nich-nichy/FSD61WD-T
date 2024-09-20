// Person class
class Person {
    constructor(name, age, email, phoneNumber) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    getDetails() {
        return `
            Name: ${this.name}
            Age: ${this.age}
            Email: ${this.email}
            Phone: ${this.phoneNumber}
        `;
    }
}


// Uber class
class UberPriceCalculator {
    constructor(baseFare, costPerKm, costPerMinute) {
        this.baseFare = parseFloat(baseFare);
        this.costPerKm = parseFloat(costPerKm);
        this.costPerMinute = parseFloat(costPerMinute);
    }

    calculateFare(distanceInKm, timeInMinutes) {
        distanceInKm = parseFloat(distanceInKm);
        timeInMinutes = parseFloat(timeInMinutes);

        if (isNaN(distanceInKm) || isNaN(timeInMinutes)) {
            return 'Invalid input for distance or time';
        }

        const distanceCost = this.costPerKm * distanceInKm;
        const timeCost = this.costPerMinute * timeInMinutes;
        const totalFare = this.baseFare + distanceCost + timeCost;

        return totalFare;
    }
}

const person1 = new Person('Jonal', 30, 'jonal@example.com', '0000011111');
console.log('From person class', person1.getDetails());

const uberCalculator = new UberPriceCalculator(3, 1.5, 0.2);
const fare = uberCalculator.calculateFare(10, 15);
console.log(`From uber class: $${fare.toFixed(2)}`);

document.getElementById('person').textContent = `From person class: ${person1.getDetails()}`;
document.getElementById('uber').textContent = `Total fare from uber class: $${fare.toFixed(2)}`

