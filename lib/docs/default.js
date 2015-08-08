
import { capitalize, pluralize, camelFromDash } from '../string-util';

export function pathTemplate(obj) {
  return JSON.parse(`{
    "/${pluralize(obj.identity)}": {
      "get": {
        "tags": [ "${pluralize(camelFromDash(obj.identity))}" ],
        "summary": "List ${camelFromDash(camelFromDash(obj.tableName))} object in ${capitalize(obj.connection)}",
        "responses": {
          "200": {
            "description": "Successfully retrieved list of ${camelFromDash(obj.identity)}",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/${camelFromDash(obj.identity)}"
              }
            }
          }
        }
      },
      "post": {
        "tags": [ "${pluralize(camelFromDash(obj.identity))}" ],
        "summary": "Create new ${camelFromDash(obj.tableName)} object in ${camelFromDash(obj.connection)}",
        "responses": {
          "201": {
            "description": "Successfully created ${camelFromDash(obj.identity)}",
            "schema": {
              "type": "object",
              "$ref": "#/definitions/${camelFromDash(obj.identity)}"
            }
          }
        },
        "parameters": [
          {
            "name": "data",
            "description": "Filter results based on a criterion",
            "in": "body",
            "schema": {
              "type": "object",
              "$ref": "#/definitions/${camelFromDash(obj.identity)}"
            }
          }
        ]
      }
    },
    "/${pluralize(obj.identity)}/{id}": {
      "get": {
        "tags": [ "${pluralize(camelFromDash(obj.identity))}" ],
        "summary": "List ${camelFromDash(obj.tableName)} object in ${capitalize(obj.connection)}",
        "responses": {
          "200": {
            "description": "Successfully retrieved list of ${camelFromDash(obj.identity)}",
            "schema": {
              "$ref": "#/definitions/${camelFromDash(obj.identity)}"
            }
          }
        }
      },
      "put": {
        "tags": [ "${pluralize(camelFromDash(obj.identity))}" ],
        "summary": "Create new ${camelFromDash(obj.tableName)} object in ${capitalize(obj.connection)}",
        "responses": {
          "201": {
            "description": "Successfully created ${camelFromDash(obj.identity)}",
            "schema": {
              "type": "object",
              "$ref": "#/definitions/${camelFromDash(obj.identity)}"
            }
          }
        },
        "parameters": [
          {
            "name": "data",
            "description": "Filter results based on a criterion",
            "in": "body",
            "schema": {
              "type": "object",
              "$ref": "#/definitions/${camelFromDash(obj.identity)}"
            }
          }
        ]
      },
      "patch": {
        "tags": [ "${pluralize(camelFromDash(obj.identity))}" ],
        "summary": "Updates fields in ${camelFromDash(obj.tableName)} object in ${capitalize(obj.connection)}",
        "responses": {
          "200": {
            "description": "Successfully updated ${camelFromDash(obj.identity)}",
            "schema": {
              "type": "object",
              "$ref": "#/definitions/${camelFromDash(obj.identity)}"
            }
          }
        },
        "parameters": [
          {
            "name": "data",
            "description": "Filter results based on a criterion",
            "in": "body",
            "schema": {
              "type": "object",
              "$ref": "#/definitions/${camelFromDash(obj.identity)}"
            }
          }
        ]
      }
    }
  }`);
}
