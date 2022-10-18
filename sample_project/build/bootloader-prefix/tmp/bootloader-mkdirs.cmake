# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

cmake_minimum_required(VERSION 3.5)

file(MAKE_DIRECTORY
  "/Users/laurenlugo/esp/esp-idf/components/bootloader/subproject"
  "/Users/laurenlugo/solar_power_battery/solar_power_battery/sample_project/build/bootloader"
  "/Users/laurenlugo/solar_power_battery/solar_power_battery/sample_project/build/bootloader-prefix"
  "/Users/laurenlugo/solar_power_battery/solar_power_battery/sample_project/build/bootloader-prefix/tmp"
  "/Users/laurenlugo/solar_power_battery/solar_power_battery/sample_project/build/bootloader-prefix/src/bootloader-stamp"
  "/Users/laurenlugo/solar_power_battery/solar_power_battery/sample_project/build/bootloader-prefix/src"
  "/Users/laurenlugo/solar_power_battery/solar_power_battery/sample_project/build/bootloader-prefix/src/bootloader-stamp"
)

set(configSubDirs )
foreach(subDir IN LISTS configSubDirs)
    file(MAKE_DIRECTORY "/Users/laurenlugo/solar_power_battery/solar_power_battery/sample_project/build/bootloader-prefix/src/bootloader-stamp/${subDir}")
endforeach()
