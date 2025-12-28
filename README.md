# CodeRunner

## Overview

CodeRunner is a service that allows users to execute code securely using a sandboxed environment. It is designed to support multiple languages and provides a safe, isolated execution context for running user-submitted code.

## Features

- **Sandboxed Execution:** Runs code in a secure, isolated environment to prevent unauthorized access and ensure safety.
- **Multi-language Support:** Easily extendable to support various programming languages.
- **API Integration:** Expose endpoints for submitting code and retrieving results.
- **Resource Limits:** Enforces execution timeouts and memory limits for safe operation.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the server:**
   ```bash
   npm start
   ```
3. **Submit code for execution:**
   Use the provided API endpoints to submit code and receive output.

## Technologies Used

- **Node.js** & **TypeScript**
- **@e2b/code-interpreter** (for sandboxed code execution)

## Example Usage

Send a POST request to the API endpoint with your code snippet and language. The service will return the output or any errors encountered during execution.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
