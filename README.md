# Stream Connect

Stream Connect is a user interface for the StreamConnect-Bridge, a backend/CLI application that bridges multiple programs together. It allows these programs to communicate with each other without having direct knowledge about each app's API. Stream Connect is an Electron app built with SvelteKit, developed by ItWasEnder.

## Description

Stream Connect provides a user-friendly interface to manage and monitor the communication between different applications. It leverages the power of StreamConnect-Bridge to seamlessly integrate multiple programs, making it easier to create complex workflows and systems.

## Installation

To install the project, follow these steps:

1. Clone the repository: `git clone https://github.com/EnderGamingFilms/StreamConnect.git`
2. Run the setup script: `python setup.py`
3. Select the installation option: `1`

The setup script will automatically install the required npm packages for the project and package it for installation of the standalone application.

## Usage

After installation, you can run the project in development mode or build it for production using the commands provided in the `package.json` file.

To run the project in development mode, use the following command:

```bash
npm run dev
```

## Updating

To update the project, simply run the setup script again: python setup.py. The script will automatically update the main app and the StreamConnect-Bridge repository.

## Packaging

To package the project for distribution, run the setup script with the package option: python setup.py package. The script will automatically package both the main app and the StreamConnect-Bridge repository

## Contributing

Contributions are welcome. Please make sure to update tests as appropriate.