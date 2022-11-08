#ifndef _SENSOR_H
#define _SENSOR_H

typedef struct{
    int16_t mppt_voltage;
    adc1_channel_t sensor_gpio;
}Sensor;

void Sensor_ctor(Sensor * const me, int16_t mppt_voltage, adc1_channel_t sensor_gpio);
int sensor_adc(Sensor* const me);
void sensor_dac(Sensor* const me, int updated_voltage);

#endif