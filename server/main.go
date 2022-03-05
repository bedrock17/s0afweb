package main

import (
	"github.com/bedrock17/s0afweb/dao"
	_ "github.com/bedrock17/s0afweb/docs"
	"github.com/bedrock17/s0afweb/handler"
	"github.com/bedrock17/s0afweb/models"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
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
	db, err := gorm.Open(sqlite.Open("db.sqlite"), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		panic("failed to connect database")
	}
	models.Migrate(db)
	dao.InitRepository(db)

	e := echo.New()
	e.Validator = &handler.RequestValidator{
		Validator: validator.New(),
	}
	handler.InitV1Handler(e)
	e.Logger.Fatal(e.Start(":8080"))
}
