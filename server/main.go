package main

import (
	"github.com/bedrock17/s0afweb/dao"
	"github.com/bedrock17/s0afweb/handler"
	"github.com/bedrock17/s0afweb/models"
	"github.com/labstack/echo/v4"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

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
	handler.InitV1Handler(e)
	e.Logger.Fatal(e.Start(":8080"))
}
