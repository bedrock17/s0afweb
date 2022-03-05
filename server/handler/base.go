package handler

import (
	"github.com/labstack/echo/v4"
)

type BaseResponse struct {
	code int
	data interface{}
	err  error
}

// BaseHttpResponse Base HTTP response
// @Description Default HTTP response object
type BaseHttpResponse struct {
	data  interface{}
	error error
}

func BaseHandler(handler func(echo.Context) BaseResponse) func(c echo.Context) error {
	return func(c echo.Context) error {
		resp := handler(c)
		return c.JSON(resp.code, BaseHttpResponse{
			data:  resp.data,
			error: resp.err,
		})
	}
}
