package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"net/http"
)

type BaseResponse struct {
	code int
	data interface{}
	err  error
}

// BaseHttpResponse Base HTTP response
// @Description Default HTTP response object
type BaseHttpResponse struct {
	Data  interface{} `json:"data"`
	Error error       `json:"error"`
}

func BaseHandler(handler func(echo.Context) BaseResponse) func(c echo.Context) error {
	return func(c echo.Context) error {
		resp := handler(c)
		return c.JSON(resp.code, &BaseHttpResponse{
			Data:  resp.data,
			Error: resp.err,
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
