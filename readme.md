# 🚀 Kedubak Mouli: All-in-One Testing Repository

## What is Kedubak Mouli?

Kedubak Mouli is an all-in-one repository containing a plethora of scripts designed to test API functionality and security aspects of a project.

## Prerequisites

Before using Kedubak Mouli, ensure the following prerequisites are met:

- The backend to be tested must be running in a Docker container tagged as `kedubak`.
- Expose the Docker container on ports `8080:8080`.

## How to Use Kedubak Mouli?

Using Kedubak Mouli is incredibly simple. Just execute the following command:

```bash
./mouli.sh
```

## Parameters

While not mandatory in 90% of cases, you have a `.env` file that can be filled. The `.env` file is self-documented, making configuration straightforward.

## Files & Folders

- **src**: Contains all the Jest tests.
- **ip.sh**: Script to retrieve the Docker IP, used as a host to test the API.
- **check_leaked_env.sh**: Script to check if there are any leaked `.env` files in the project's commits.
- **mouli.sh**: The main script that executes all others.