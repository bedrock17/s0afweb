package main

import (
	"fmt"
	"github.com/bedrock17/s0afweb/dao"
	_ "github.com/bedrock17/s0afweb/docs"
	"github.com/bedrock17/s0afweb/handler"
	"github.com/bedrock17/s0afweb/models"
	"github.com/bedrock17/s0afweb/service"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"os"
)

// @title Poptile!
// @version 1.0
// @description Poptile Game Server
// @termsOfService http://swagger.io/terms/

// @contact.name seokhwan
// @contact.url https://github.com/bedrock17
// @contact.email bedrook@gmail.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /v1
func main() {
	err := godotenv.Load()
	if err != nil {
		panic("failed to load .env file")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASS"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	models.Migrate(db)
	dao.InitRepository(db)
	service.InitService()

	e := echo.New()
	secret := "CGvGMij3&NVxp5wdYZcrU36!8*tDK8gT8SvGD*&qYkc2E$Ks*wEwrR^4%m*8eu#VA%F!WcFUAWV#PcvSP7bTD%uFMUt%aRQ9DQk#tv#mC3ApKq^W^FFsisT*%DGKS&G6"
	e.Use(middleware.Logger())
	e.Use(session.Middleware(sessions.NewCookieStore([]byte(secret))))
	e.Validator = &handler.RequestValidator{
		Validator: validator.New(),
	}
	handler.InitV1Handler(e)
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%v", os.Getenv("PORT"))))
}
