#include <stdio.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "driver/dac.h"
#include "driver/adc.h"
#include "sensor.h"

void Sensor_ctor(Sensor * const me, int16_t mppt_voltage, adc1_channel_t sensor_gpio)
{
    me->mppt_voltage = mppt_voltage;
    me->sensor_gpio = sensor_gpio;
}

int sensor_adc(Sensor* const me)
{
    adc1_config_width(ADC_WIDTH_12Bit);
    adc1_config_channel_atten(me->sensor_gpio, ADC_ATTEN_11db);
    while(true){
        int val= adc1_get_raw(me->sensor_gpio);
        vTaskDelay(5000/portTICK_PERIOD_MS);
        return val;
    }
}

void sensor_dac(Sensor* const me, int updated_voltage)
{
    //Will need to change the value to increase by a specific voltage. 
    dac_output_enable(DAC_CHANNEL_1);
    if(updated_voltage >= (me->mppt_voltage)){
        dac_output_voltage(DAC_CHANNEL_1, 255);
    }
    else{
        dac_output_voltage(DAC_CHANNEL_1, 100);
    }
}
