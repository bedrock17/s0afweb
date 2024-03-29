// Package docs GENERATED BY THE COMMAND ABOVE; DO NOT EDIT
// This file was generated by swaggo/swag
package docs

import "github.com/swaggo/swag"

const docTemplate_swagger = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "seokhwan",
            "url": "https://github.com/bedrock17",
            "email": "bedrook@gmail.com"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/leaderboard": {
            "get": {
                "description": "Get current leaderboards",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Leaderboard Endpoints"
                ],
                "summary": "Get leaderboards",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/handler.BaseHttpResponse"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/definitions/handler.LeaderboardResponse"
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/handler.BaseHttpResponse"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "error": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            "post": {
                "description": "Register new score (if username exists, update score)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Leaderboard Endpoints"
                ],
                "summary": "Post leaderboard",
                "parameters": [
                    {
                        "description": "Leaderboard Information (all required)",
                        "name": "data",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.Leaderboard"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Created"
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/handler.BaseHttpResponse"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "error": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/handler.BaseHttpResponse"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "error": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/seed": {
            "get": {
                "description": "Get Single play game seed",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Game SinglePlay Endpoints"
                ],
                "summary": "Get Single play game seed",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/handler.BaseHttpResponse"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "type": "integer"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/handler.BaseHttpResponse"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "error": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "handler.BaseHttpResponse": {
            "description": "Default HTTP response object",
            "type": "object",
            "properties": {
                "data": {},
                "error": {
                    "type": "string"
                }
            }
        },
        "handler.LeaderboardResponse": {
            "type": "object",
            "required": [
                "score",
                "touches",
                "username"
            ],
            "properties": {
                "score": {
                    "type": "integer"
                },
                "touches": {
                    "type": "integer"
                },
                "username": {
                    "type": "string",
                    "maxLength": 32,
                    "minLength": 1
                }
            }
        },
        "models.Leaderboard": {
            "description": "leaderboard model",
            "type": "object",
            "required": [
                "score",
                "seed",
                "touch_history",
                "touches",
                "username"
            ],
            "properties": {
                "score": {
                    "type": "integer"
                },
                "seed": {
                    "type": "integer"
                },
                "touch_history": {
                    "type": "string"
                },
                "touches": {
                    "type": "integer"
                },
                "username": {
                    "type": "string",
                    "maxLength": 32,
                    "minLength": 1
                }
            }
        }
    }
}`

// SwaggerInfo_swagger holds exported Swagger Info so clients can modify it
var SwaggerInfo_swagger = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:8080",
	BasePath:         "/v1",
	Schemes:          []string{},
	Title:            "Poptile!",
	Description:      "Poptile Game Server",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate_swagger,
}

func init() {
	swag.Register(SwaggerInfo_swagger.InstanceName(), SwaggerInfo_swagger)
}
