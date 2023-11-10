#!/bin/bash

# Root directory of app
ROOT_DIR=$(git rev-parse --show-toplevel)

# Directory holding all .proto files
SRC_DIR="${ROOT_DIR}/proto"

# Directory to write generated code (.d.ts files)
OUT_DIR="${ROOT_DIR}/src/generated"

# Clean all existing generated files
rm -r "${OUT_DIR}"
mkdir "${OUT_DIR}"

# Generate all messages
npx protoc \
  --ts_opt long_type_string \
  --ts_opt optimize_code_size \
  --ts_opt force_server_none \
  --ts_out="${OUT_DIR}" \
  --proto_path="${SRC_DIR}" \
  $(find "${SRC_DIR}" -iname "*.proto")