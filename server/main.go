package main

import (
	"github.com/bedrock17/s0afweb/handler"
	"github.com/bedrock17/s0afweb/models"
	"github.com/bedrock17/s0afweb/server"
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

	serverContext := server.Init(db)
	handler.InitV1Handler(serverContext)
	echo.Logger.Fatal(serverContext.Run(":8080"))
}
