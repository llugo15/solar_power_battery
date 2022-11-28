#include <stdio.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "driver/dac.h"
#include "driver/adc.h"
#include "sensor.h"

void Sensor_ctor(Sensor * const me, double max_voltage, adc1_channel_t sensor_gpio)
{
    me->max_voltage = max_voltage;
    me->sensor_gpio = sensor_gpio;
}

int sensor_adc(Sensor* const me)
{
    adc1_config_width(ADC_WIDTH_12Bit);
    adc1_config_channel_atten(me->sensor_gpio, ADC_ATTEN_11db);
    while(true){
        int val= adc1_get_raw(me->sensor_gpio);
        val = (val*(me->max_voltage))/4096;
        vTaskDelay(5000/portTICK_PERIOD_MS);
        return val;
    }
}

void converter_out(Sensor* const me, double updated_voltage)
{
    dac_output_enable(DAC_CHANNEL_1);
    if(updated_voltage <= (me->max_voltage)){
            /*Will need to change the value to increase 
            by a specific voltage.*/
        dac_output_voltage(DAC_CHANNEL_1, 255);
    }
    else{
        dac_output_voltage(DAC_CHANNEL_1, 100);
    }
}
