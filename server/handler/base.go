package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"net/http"
)

type BaseResponse struct {
	Code  int
	Data  interface{}
	Error error
}

// BaseHttpResponse Base HTTP response
// @Description Default HTTP response object
type BaseHttpResponse struct {
	Data  interface{} `json:"data"`
	Error string      `json:"error"`
}

func BaseHandler(handler func(echo.Context) BaseResponse) func(c echo.Context) error {
	return func(c echo.Context) error {
		resp := handler(c)

		err := ""
		if resp.Error != nil {
			err = resp.Error.Error()
		}

		return c.JSON(resp.Code, BaseHttpResponse{
			Data:  resp.Data,
			Error: err,
		})
	}
}

type RequestValidator struct {
	Validator *validator.Validate
}

func (v *RequestValidator) Validate(i interface{}) error {
	if err := v.Validator.Struct(i); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return nil
}
