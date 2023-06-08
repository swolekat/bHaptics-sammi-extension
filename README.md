# bHaptics-sammi-extension
Sammi plugin for controlling a bHaptics vest through sammi

# Prereqs
* Must be running the bHaptics Player

#Usage
This extension adds two new commands `BHaptics Dot` and `BHaptics Path`.

## BHaptics Dot
This controls a single motor. 
* The index can be 0 through 19. O is top left motor. They're laid out in 5 rows of 4.
* Intensity is 0 to 1 used with a slider.
* Duration is in milliseconds
* Position is either in the front or back

## BHaptics Path
This draws a line and activates all motors on that line.
* Points are a JSON array with objects of the following shape
  * Intensity - number from 0 to 100
  * X - number from 0 to 1
  * Y - number from 0 to 1
* Duration is in milliseconds
* Position is either in the front or back

# Development
This package compiles `tact-js` to use js and wraps it in a simple interface. To update run `npm run dev` and copy the result into the `.sef` file. 