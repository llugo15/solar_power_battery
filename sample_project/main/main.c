#include <stdio.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "driver/gpio.h"
#include "esp_log.h"

#define BLINK_GPIO 5

void hello_task(void)
{
    while(1){
        printf("Hello World!\n");
        vTaskDelay(100/portTICK_PERIOD_MS);
    }
}

void blinky(void)
{
    gpio_reset_pin(BLINK_GPIO);
    gpio_set_direction(BLINK_GPIO, GPIO_MODE_OUTPUT);
    while(1)
    {
        printf("Blink on!\n");
        gpio_set_level(BLINK_GPIO, 0);
        vTaskDelay(1000/portTICK_PERIOD_MS);
        /*Light On*/
        printf("Blink off!\n");
        gpio_set_level(BLINK_GPIO, 1);
        vTaskDelay(1000/portTICK_PERIOD_MS);
    }
}

void app_main(void)
{
    //xTaskCreate(&hello_task, "hello_task", 2048, NULL, 5, NULL);
    //xTaskCreate(&blinky, "blinky", 512, NULL, 5, NULL);
    esp_log_level_set("LOGGING", ESP_LOG_INFO);
    blinky();
}
