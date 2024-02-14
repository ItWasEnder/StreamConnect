#!/usr/bin/env python3

# This script will automagically install the required npm packages for the project as well
# as package for installation of the standalone application.

import os
import sys
import subprocess
import shutil
import pathlib

npm_cmd = shutil.which("npm")  # For Windows compatibility
app_dir = os.path.abspath('./app')
bridge_repo_dir = os.path.join(app_dir, 'StreamConnect-Bridge')
bridge_git_repo = 'https://github.com/EnderGamingFilms/StreamConnect-Bridge.git'

def main():
    while True:
        print("Please choose an option:")
        print("1: Install")
        print("2: Package")
        print("3: Reset & Update")
        print("4: Quit")
        choice = input("Enter your choice (1-4): ")

        if choice == '1':
            install()
        elif choice == '2':
            package()
        elif choice == '3':
            update_project()
        elif choice == '4':
            print("Quitting...")
            os._exit(0)
        else:
            os.system('cls' if os.name == 'nt' else 'clear')  # Clear screen for both Windows and Unix
            print("Invalid choice. Please enter 1, 2, or 3.")

def check_and_install_dependencies(directory):
    os.chdir(directory)  # Change to the target directory
    if os.path.isfile("package.json"):
        check_deps = str(pathlib.Path("./node_modules/.bin/check-dependencies"))
        if not os.path.isfile(check_deps) or subprocess.call([check_deps], shell=True) != 0:
            exit_code = subprocess.call([npm_cmd, "install"])
            if exit_code != 0:
                print("Failed to install npm packages in", directory)
                sys._exit(exit_code)
        else:
            print("All necessary npm packages are installed in", directory)

def install():
    print("Starting installation...")

    # Check and install dependencies for the main app
    check_and_install_dependencies(app_dir)

    # Clone the repository
    subprocess.run(['git', 'clone', bridge_git_repo], cwd=app_dir)

    # Check and install dependencies for the bridge repo
    check_and_install_dependencies(bridge_repo_dir)

    # Run build command for the bridge repo
    subprocess.run([npm_cmd, 'run', 'build'], cwd=bridge_repo_dir)

    print("Installation and build process complete.")

def package():
    print("Starting packaging...")

    # Run package command for both the bridge and the main app
    subprocess.run([npm_cmd, 'run', 'package'], cwd=bridge_repo_dir)
    subprocess.run([npm_cmd, 'run', 'package'], cwd=app_dir)

    print("Packaging complete.")

def update_project():
    print("Updating the main app directory...")
    update_directory(app_dir)

    print("Updating the Bridge repository directory...")
    update_directory(bridge_repo_dir)

    print("Update complete.")

def update_directory(directory):
    if os.path.exists(directory):
        print(f"Fetching latest changes in {directory}...")
        subprocess.run(['git', 'fetch', '--all'], cwd=directory)
        subprocess.run(['git', 'reset', '--hard', 'origin/main'], cwd=directory)
        subprocess.run(['git', 'pull'], cwd=directory)
        
        # Install any new dependencies
        check_and_install_dependencies(directory)
    else:
        print(f"The directory {directory} does not exist. Please run the Install option first.")

if __name__ == "__main__":
    main()