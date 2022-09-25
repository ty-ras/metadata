# Typesafe REST API Specification - Metadata Related Generic Libraries

[![CI Pipeline](https://github.com/ty-ras/metadata/actions/workflows/ci.yml/badge.svg)](https://github.com/ty-ras/metadata/actions/workflows/ci.yml)
[![CD Pipeline](https://github.com/ty-ras/metadata/actions/workflows/cd.yml/badge.svg)](https://github.com/ty-ras/metadata/actions/workflows/cd.yml)

The Typesafe REST API Specification is a family of libraries used to enable seamless development of Backend and/or Frontend which communicate via HTTP protocol.
The protocol specification is checked both at compile-time and run-time to verify that communication indeed adhers to the protocol.
This all is done in such way that it does not make development tedious or boring, but instead robust and fun!

This particular repository contains generic metadata related libraries, and is designed to be consumed by other TyRAS libraries.
- [metadata](./metadata) contains metadata related types and utilities, without specifying which metadata technique (OpenAPI or something else) to use, and
- [metadata-jsonschema](./metadata-jsonschema) contains metadata related types and utilities to work with JSON Schema.

Notice that neither of the above libraries use OpenAPI concepts.
See [TyRAS OpenAPI library](https://github.com/ty-ras/metadata-openapi) for the library which allows generating OpenAPI data from TyRAS endpoints.
