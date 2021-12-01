# pitch-finder

## Author(s)

Ethan Rickert

## Description

The pitch-finder module for .Hum calculates a series of pitches (using the [pitchfinder](https://github.com/peterkhayes/pitchfinder) package) in a given audio file using information received from Daniel's percussion module which provides the necessary functions to detect the bpm & quantization of an audio file.

## Product

The pitch-finder module produces a list of the pitches (frequencies) in musical notation. e.g. an audio file containing the frequencies 261.63 Hz, 293.66 Hz, and 329.63 Hz will produce a list of [C4, D4, E4].
