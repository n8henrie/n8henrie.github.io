---
id: 2706
title: 'Range Testing for Wireless Arduino Projects: RF 433 MHZ and NRF24L01+'
date: 2015-03-12T08:37:02+00:00
author: n8henrie
excerpt: "I tested maximum line-of-site range with an NRF24L01+ and a 433 MHz transceiver that I'll be using from some Arduino and Raspberry Pi projects."
layout: post
guid: http://n8henrie.com/?p=2706
permalink: /2015/03/range-testing-for-wireless-arduino-projects-rf-433-mhz-and-nrf24l01/
dsq_thread_id:
  - 3594767337
disqus_identifier: 2706 http://n8henrie.com/?p=2706
tags:
- arduino
- electronics
- homeautomation
- raspberrypi
categories:
- tech
---
**Bottom Line:** I tested maximum line-of-site range with an NRF24L01+ and a 433 MHz transceiver that I’ll be using from some Arduino and Raspberry Pi projects.<!--more-->

I’m learning some basic home automation stuff with Arduino and Raspberry Pi, and I decided to try out some ways to do things wirelessly. I’ve used the affordable <a href="https://www.amazon.com/dp/B00JP05S6C/ref=cm_sw_r_awd_8C18ub01QBNZ9" target="_blank">HC05</a> Bluetooth module for a few small projects, and it worked well, but its range is somewhat limited. Instead, I wanted to try out two even _more_ affordable options that might get me a little extra range: a 433 MHz RF module, and the venerable NRF24L01+. Additionally, I tried adding an antenna to the RF module to see if that would help and a couple different models (e.g. one with an antenna) and settings on the NRF24L01+ to see if that would change things.

For the test, I made a sketch that would continuously send a signal to toggle an LED light on and off once per second on a “client” (an atmega328p on a breadboard). After I made sure they worked well at close range, I took them out to my front yard, where I’m lucky enough to have a fairly long straight road. I set the Arduino in my front yard and carried the “client” with me, watching the LED. I considered the maximum range to be the farthest point with a clear line of sight that I would pretty consistently get 10 / 10 toggles transmitted. Then, I marked the spot on Google Maps on my iPhone, and afterwards I used Google Earth to find the distances.

## 433 MHZ RF Module

Here’s <a href="http://n8h.me/1HWwr7E" target="_blank">the RF module I used</a>.

I wanted to make sure that my results were absolutely maximal, so I used 6 brand new batteries to ensure my voltage going to the RF module was not an issue. I measured the input voltage at 9.54V.

Without an antenna, my range was about 47 feet (~14 meters) — not bad for such a cheap device! Then I read a few threads on how to make an 1/4 wavelength antenna and made one out of 22 gauge wire (17.4 cm to the bend where I soldered it in). I was impressed by the results — it improved the range by over 200% to 102 feet (31 meters)!

For anyone interested, here is the code I used for the Arduino. Unfortunately I can’t find where I put the code for the client, but it was something just as simple, almost directly copied from the RC-Switch examples.

    /*
      RC-Switch library: http://code.google.com/p/rc-switch
    */
    
    #define RF_DATA_PIN 10
    #define LED_PIN 13
    
    #include <RCSwitch.h>   
    RCSwitch mySwitch = RCSwitch();
    
    void setup() {
      pinMode(LED_PIN, OUTPUT);
    
      mySwitch.enableTransmit(RF_DATA_PIN);
    
      mySwitch.setPulseLength(190);   
    }
    
    void loop() {   
      mySwitch.send(1234567890, 24);
      delay(1000);  
      mySwitch.send(0987654321, 24);
      delay(1000);      
    }
    

## NRF24L01+

For these tests, I was using <a href="https://github.com/tmrh20/RF24/" target="_blank">this excellent RF24 Library</a> as it’s still being maintained and includes Raspberry Pi code as well as Arduino code. In preliminary testing around the house, I’d found that setting `radio.setPALevel(RF24_PA_MAX)` and `radio.setDataRate(RF24_250KBPS)` made a _tremendous_ difference in the range — the results I’m presenting below are with these settings.

For the NRF24L01+, I started out with <a href="http://n8h.me/1s9UqMI" target="_blank">this basic model</a>, because it is so incredibly cheap, and it has its pinout printed right on the board. With the right settings, I was **blown away** by its range! I got a full 384 ft (117 meters).

Next, I tried <a href="http://n8h.me/1s9Ug8b" target="_blank">this model</a>, which is a little more expensive but has an antenna and advertises a very long range. Note that I only use _one_ of these antenna-bearing models for this test. This was in part because I didn’t want to buy two without knowing how well they worked, and in part because I plan on only having one for my home automation “server” and using the smaller, cheaper antenna-less modules for various clients around the house. Using the model with the antenna, I was surprised to get a full 826 feet (251 meters) of range with good reliability, and up to 921 feet (280 meters) with at least half of the toggles transmitting properly.

Here’s the code I used for the NRF24L01+ tests, which is directly taken from the RF24 examples. For the “client,” I think I just had to change the `bool radioNumber = 1` and `bool role = 1;` to ``.

    #define LEDPIN 3
    #include <SPI.h>
    #include "RF24.h"
    #include <printf.h>
    
    /****************** User Config ***************************/
    /***      Set this radio as radio number 0 or 1         ***/
    bool radioNumber = 1;
    
    /* Hardware configuration: Set up nRF24L01 radio on SPI bus plus pins 7 & 8 */
    RF24 radio(7,8);
    /**********************************************************/
    
    byte addresses[][6] = {"1Node","2Node"};
    
    // Used to control whether this node is sending or receiving
    bool role = 1;
    
    void setup() {
    
      pinMode(LEDPIN, OUTPUT);
      printf_begin();
    
      Serial.begin(57600);
      Serial.println(F("RF24/examples/GettingStarted"));
      Serial.println(F("*** PRESS 'T' to begin transmitting to the other node"));
    
      radio.begin();
    
      radio.setPALevel(RF24_PA_MAX);    
      radio.setDataRate(RF24_250KBPS);
    
      // Open a writing and reading pipe on each radio, with opposite addresses
      if(radioNumber){
        radio.openWritingPipe(addresses[1]);
        radio.openReadingPipe(1,addresses[0]);
      }else{
        radio.openWritingPipe(addresses[0]);
        radio.openReadingPipe(1,addresses[1]);
      }
    
      // Start the radio listening for data
      radio.startListening();
    }
    
    void loop() {
    
    
    /****************** Ping Out Role ***************************/  
    if (role == 1)  {
    
        radio.stopListening();
    
        Serial.println(F("Now sending"));
    
        unsigned long time = micros();
         if (!radio.write( &time, sizeof(unsigned long) )){
           Serial.println(F("failed"));
         }
    
        radio.startListening();                                    // Now, continue listening
    
        unsigned long started_waiting_at = micros();               // Set up a timeout period, get the current microseconds
        boolean timeout = false;                                   // Set up a variable to indicate if a response was received or not
    
        while ( ! radio.available() ){                             // While nothing is received
          if (micros() - started_waiting_at > 200000 ){            // If waited longer than 200ms, indicate timeout and exit while loop
              timeout = true;
              break;
          }      
        }
    
        if ( timeout ){                                             // Describe the results
            Serial.println(F("Failed, response timed out."));
        }else{
            unsigned long got_time;                                 // Grab the response, compare, and send to debugging spew
            radio.read( &got_time, sizeof(unsigned long) );
            unsigned long time = micros();
    
            // Spew it
            Serial.print(F("Sent "));
            Serial.print(time);
            Serial.print(F(", Got response "));
            Serial.print(got_time);
            Serial.print(F(", Round-trip delay "));
            Serial.print(time-got_time);
            Serial.println(F(" microseconds"));
    
            Serial.println(radio.getDataRate());
            radio.printDetails();
            digitalWrite(LEDPIN, HIGH);
            delay(100);
            digitalWrite(LEDPIN, LOW);
    
        }
    
        // Try again 1s later
        delay(1000);
      }
    
    
    
    /****************** Pong Back Role ***************************/
    
      if ( role == 0 )
      {
        unsigned long got_time;
    
        if( radio.available()){
                                                                        // Variable for the received timestamp
          while (radio.available()) {                                   // While there is data ready
            radio.read( &got_time, sizeof(unsigned long) );             // Get the payload
          }
    
          radio.stopListening();                                        // First, stop listening so we can talk   
          radio.write( &got_time, sizeof(unsigned long) );              // Send the final one back.      
          radio.startListening();                                       // Now, resume listening so we catch the next packets.     
          Serial.print(F("Sent response "));
          Serial.println(got_time);  
       }
     }
    
    } // Loop
    

So in summary, here were my results:

| Module                              | Range without antenna           | Range with antenna              |
| ----------------------------------- | ------------------------------- | ------------------------------- |
| [433 MHz RF](http://n8h.me/1HWwr7E) | 47 ft                           | 102 ft                          |
| NRF24L01+                           | [384 ft](http://n8h.me/1s9UqMI) | [826 ft](http://n8h.me/1s9Ug8b) |