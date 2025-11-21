function getProductionOrder(jsonInput) {
  // Placeholder distances for clients (in arbitrary units, e.g., km)
  const clientDistances = {
    a: 10,
    b: 30,
    c: 5,
    d: 20
  };

  // Parse JSON input
  const data = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;

  // Convert production times to a map for quick lookup
  const productionTimeMap = {};
  data.production_time.forEach(({ item, time }) => {
    productionTimeMap[item] = parseInt(time); // Assume time is in minutes
  });

  // Convert deadlines to hours for consistent comparison
  const deadlineToHours = (deadline) => {
    return parseInt(deadline) * 24; // Convert days to hours
  };

  // Create tasks: one per item unit
  const tasks = [];
  data.orders.forEach(order => {
    const client = order.client;
    const deadlineHours = deadlineToHours(order.deadline);
    const distance = clientDistances[client] || 100; // Default distance if not specified
    Object.entries(order.items).forEach(([item, quantity]) => {
      for (let i = 0; i < quantity; i++) {
        tasks.push({
          client,
          item: item.replace('item_', ''), // Normalize item name (e.g., item_a -> a)
          productionTime: productionTimeMap[item.replace('item_', '')] || 10, // Default 10 min if not found
          deadline: deadlineHours,
          distance
        });
      }
    });
  });

  // Sort tasks: by deadline (asc), then distance (asc), then production time (desc)
  tasks.sort((a, b) => {
    if (a.deadline !== b.deadline) return a.deadline - b.deadline;
    if (a.distance !== b.distance) return a.distance - b.distance;
    return b.productionTime - a.productionTime;
  });

  // Group consecutive tasks for the same item and client
  const groupedTasks = [];
  let current = null;
  tasks.forEach(task => {
    if (!current || current.client !== task.client || current.item !== task.item) {
      current = { client: task.client, item: task.item, count: 1 };
      groupedTasks.push(current);
    } else {
      current.count++;
    }
  });

  // Generate production order instructions
  const productionOrder = groupedTasks.map(task => 
    `Produce ${task.count} unit${task.count > 1 ? 's' : ''} of item ${task.item} for client ${task.client}`
  );

  return productionOrder;
}

// Example usage:
const jsonInput = {
  "orders": [
    {
      "client": "a",
      "deadline": "3 days",
      "items": {
        "item_a": 5,
        "item_c": 13,
        "item_e": 1,
        "item_j": 3
      }
    },
    {
      "client": "b",
      "deadline": "7 days",
      "items": {
        "item_a": 5,
        "item_c": 13,
        "item_d": 1,
        "item_j": 3
      }
    },
    {
      "client": "c",
      "deadline": "3 days",
      "items": {
        "item_a": 2,
        "item_e": 1,
        "item_f": 5
      }
    },
    {
      "client": "d",
      "deadline": "5 days",
      "items": {
        "item_d": 13,
        "item_e": 1,
        "item_j": 8
      }
    }
  ],
  "production_time": [
    { "item": "a", "time": "10 min" },
    { "item": "b", "time": "12 min" },
    { "item": "c", "time": "30 min" },
    { "item": "d", "time": "20 min" },
    { "item": "e", "time": "18 min" },
    { "item": "f", "time": "24 min" },
    { "item": "j", "time": "30 min" }
  ]
};

// Run the function
const order = getProductionOrder(jsonInput);
console.log(order.join('\n'));