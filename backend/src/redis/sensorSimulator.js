import redisClient from './redisClient.js';
import { sensors } from './sensors.js';
import { randomBetween } from './utils.js';

const INTERVAL = Number(process.env.SIMULATION_INTERVAL || 3000);

async function simulateSensor(sensor) {
  const value = randomBetween(sensor.min, sensor.max);

  const payload = {
    sensor_id: sensor.sensor_id,
    device_id: sensor.device_id,
    type: sensor.type,
    value: value.toString(),
    unit: sensor.unit,
    status: 'active',
    timestamp: new Date().toISOString(),
  };

  const key = `sensor:${sensor.sensor_id}`;

  await redisClient.hSet(key, payload);

  // Optional: expire sensor if it stops reporting
  await redisClient.expire(key, 30);

  console.log(`📡 ${sensor.sensor_id} → ${value} ${sensor.unit}`);
}

export function startSensorSimulation() {
  console.log(`🚀 Sensor simulation started (interval ${INTERVAL}ms)`);

  setInterval(() => {
    sensors.forEach((sensor) => {
      simulateSensor(sensor).catch(console.error);
    });
  }, INTERVAL);
}