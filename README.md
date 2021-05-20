# Alterse

> Yet another dynamic graphics application

Alterse lets you create dynamic overlays by using the filesystem.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Author](#author)
- [License](#license)

## Installation

Download the [latest release](https://github.com/Seldszar/alterse/releases/latest) or clone this repository and install the dependencies by calling `npm install`, then build the widget by calling `npm build`.

## Usage

Put the executable in a folder and create a `profiles` directory. A profile is a folder containing a `profile.json` similar to [this one](./examples/talkshow/profile.json) and two folders (`content` and `public`).

The `content` folder acts like a database where you can put your files, the application will generate a state tree which will be used by the graphics.

The `public` folder contains all the graphics and assets you which to use in your overlays. Each webpage must include the client script in order to enjoy what the application have to offer.

The application also includes a Discord plugin for retrieving voice states. If you whish to use it, you have to create an application, invite it to your server, paste the Bot Token and the voice channel ID of your choice. With that, the application will be able to provide the voice states.

If you want to see how to make it work, there's examples [available here](./examples).

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
