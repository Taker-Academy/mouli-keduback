# 🚀 Kedubak Mouli: All-in-One Testing Repository

## What is Kedubak Mouli?

Kedubak Mouli is an all-in-one repository containing a plethora of scripts designed to test API functionality and security aspects of a project.

## Prerequisites

Before using Kedubak Mouli, ensure the following prerequisites are met:

- The backend to be tested must be running in a Docker or locally.
- The Backend must be running on exposed port `8080`

## How to Use Kedubak Mouli?

Using Kedubak Mouli is incredibly simple. Just execute the following command:

```bash
./mouli.sh
```

## Parameters

In case you can't set the backend `PORT` to `8080`, you can pass the port as ENV variable by modifying the `.env` file.

```bash
PORT=8081
```

## Files & Folders


| File/Folder | Description |
| ----------- | ----------- |
| **src** | Contains all the Jest tests. |
| **check_leaked_env.sh** | Script to check if there are any leaked `.env` files in the project's commits. |
| **api_life_check.sh** | Script performing a basic curl to the backend's url to ensure it's up before running all the units tests|
| **mouli.sh** | The main script that executes all others. |