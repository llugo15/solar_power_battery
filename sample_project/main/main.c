#include <stdio.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "driver/dac.h"
#include "driver/adc.h"
#include "sensor.h"

#define PIN_SWITCH 36
#define PIN_LED 2

/* dac_output_enable(DAC_CHANNEL_1);
    if(updated_voltage >= mppt_voltage){
        dac_output_voltage(DAC_CHANNEL_1, 255);
    }
    else{
        dac_output_voltage(DAC_CHANNEL_1, 100);
    }

void blinky(void)
{
    gpio_pad_select_gpio(PIN_LED);
    gpio_set_direction(PIN_LED, GPIO_MODE_OUTPUT);

    gpio_pad_select_gpio(PIN_SWITCH);
    gpio_set_direction(PIN_SWITCH, GPIO_MODE_INPUT);
    gpio_pulldown_en(PIN_SWITCH);

    while(true )
    {
        int level = gpio_get_level(PIN_SWITCH);
        gpio_set_level(PIN_LED, level);
        vTaskDelay(1000/portTICK_PERIOD_MS);
    }
}*/

void app_main(void)
{
    Sensor solar_panel_vol, dc_vol, battery_vol;

    Sensor_ctor(&solar_panel_vol, 3476, ADC1_CHANNEL_0);
    Sensor_ctor(&dc_vol, 3476, ADC1_CHANNEL_1);
    Sensor_ctor(&battery_vol, 3476, ADC1_CHANNEL_2);

    while(true){
        int num = sensor_adc(&solar_panel_vol);
        printf("Value: %d\n", num);
        sensor_dac(&solar_panel_vol, num);   
    }
    //xTaskCreate(&hello_task, "hello_task", 2048, NULL, 2, NULL);
    //xTaskCreate(&pin_init, "pin_init", 2048, NULL, 2, NULL);
     
}


