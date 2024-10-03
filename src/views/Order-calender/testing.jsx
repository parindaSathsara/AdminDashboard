export default function testing() {

    const randomLocations = [
        'Colombo, Sri Lanka',
        'Kandy, Sri Lanka',
        'Galle, Sri Lanka',
        'Jaffna, Sri Lanka',
        'Matara, Sri Lanka',
        'Batticaloa, Sri Lanka',
        'Trincomalee, Sri Lanka',
        'Anuradhapura, Sri Lanka',
    ];

    const randomItems = [
        ['Laptop', 'Smartphone'],
        ['Sofa', 'Dining Table'],
        ['Vegetables', 'Fruits', 'Milk'],
        ['Shirt', 'Jeans', 'Jacket'],
        ['Refrigerator', 'Microwave'],
        ['TV', 'Soundbar'],
        ['Headphones', 'Smartwatch'],
        ['Shoes', 'Hat'],
    ];

    const getRandomDate = () => {
        const day = Math.floor(Math.random() * 30) + 1; // Random day between 1 and 30
        return `2024-10-${day.toString().padStart(2, '0')}`;
    };

    const getRandomTime = () => {
        const hours = Math.floor(Math.random() * 12) + 1;
        const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
        const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
        return `${hours}:${minutes} ${ampm}`;
    };

    const getRandomLocation = () => randomLocations[Math.floor(Math.random() * randomLocations.length)];

    const getRandomItems = () => randomItems[Math.floor(Math.random() * randomItems.length)];

    const generateOrders = (count) => {
        const orders = [];
        for (let i = 1; i <= count; i++) {
            orders.push({
                id: i,
                title: `Order #${i}`,
                date: getRandomDate(),
                time: getRandomTime(),
                serviceLocation: getRandomLocation(),
                items: getRandomItems(),
            });
        }
        return orders;
    };

    return generateOrders(150);
    
}
