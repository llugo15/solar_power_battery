#include <stdio.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"

#define BLINK_GPIO 13

void hello_task(void)
{
    printf("Hello Lauren!\n");
    for(int i = 10; i >= 0; i--){
        printf("restarting in %d seconds...\n", i);
        vTaskDelay(1000/portTICK_PERIOD_MS);
    }
    printf("Restarting Now...\n");
    fflush(stdout);
    esp_restart();
}

void app_main(void)
{
    hello_task();
}
